import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './db';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'diet-coach-secret-fallback-change-in-prod'
);

const COOKIE_NAME = 'dc_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

export interface SessionPayload {
  accountId: string;
  role: 'admin' | 'client';
  userId: string | null; // null até o cliente criar o perfil
}

// ─── Criar token ─────────────────────────────────────────────────────────────

export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET);
}

// ─── Verificar token ──────────────────────────────────────────────────────────

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Criar sessão (set cookie) ────────────────────────────────────────────────

export async function createSession(payload: SessionPayload) {
  const token = await createToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

// ─── Obter sessão atual ───────────────────────────────────────────────────────

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── Destruir sessão (logout) ─────────────────────────────────────────────────

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─── Obter userId do perfil da sessão ────────────────────────────────────────

export async function getSessionUserId(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  // Se já temos userId no token, usa direto
  if (session.userId) return session.userId;

  // Senão busca o perfil vinculado à conta
  const user = await prisma.user.findUnique({
    where: { accountId: session.accountId },
    select: { id: true },
  });
  return user?.id ?? null;
}

// ─── Verificar se é admin ─────────────────────────────────────────────────────

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
