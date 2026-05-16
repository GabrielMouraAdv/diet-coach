'use server';

import { compare, hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createSession, destroySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { addDays } from 'date-fns';

// ─── Login (admin e cliente usam o mesmo endpoint) ───────────────────────────

export async function loginAction(email: string, password: string, next?: string) {
  const account = await prisma.account.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!account) return { error: 'Email ou senha incorretos.' };

  const valid = await compare(password, account.passwordHash);
  if (!valid) return { error: 'Email ou senha incorretos.' };

  const profile = await prisma.user.findUnique({ where: { accountId: account.id } });

  await createSession({
    accountId: account.id,
    role: account.role as 'admin' | 'client',
    userId: profile?.id ?? null,
  });

  redirect(next ?? (account.role === 'admin' ? '/admin' : '/'));
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}

// ─── Gerar convite (admin only) ───────────────────────────────────────────────

export async function createInviteAction(data: {
  adminAccountId: string;
  clientName?: string;
  clientEmail?: string;
}) {
  const invite = await prisma.invite.create({
    data: {
      clientName: data.clientName || null,
      clientEmail: data.clientEmail || null,
      createdById: data.adminAccountId,
      expiresAt: addDays(new Date(), 7),
    },
  });
  return invite;
}

// ─── Registrar cliente via convite ───────────────────────────────────────────

export async function registerFromInviteAction(data: {
  token: string;
  email: string;
  password: string;
  name: string;
  birthDate: string;
  sex: string;
  heightCm: number;
  goal: string;
  activityLevel: string;
  baseKcal: number;
  cheatKcal: number;
  proteinGoalG: number;
  carbGoalG: number;
  fatGoalG: number;
}) {
  // Valida convite
  const invite = await prisma.invite.findUnique({ where: { token: data.token } });
  if (!invite) return { error: 'Convite inválido.' };
  if (invite.usedAt) return { error: 'Este convite já foi utilizado.' };
  if (new Date() > invite.expiresAt) return { error: 'Este convite expirou. Solicite um novo ao seu coach.' };

  // Verifica se email já existe
  const existing = await prisma.account.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) return { error: 'Este email já possui uma conta.' };

  const passwordHash = await hash(data.password, 12);

  // Cria conta + perfil atomicamente
  const account = await prisma.account.create({
    data: {
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: 'client',
      profile: {
        create: {
          name: data.name,
          birthDate: new Date(data.birthDate),
          sex: data.sex,
          heightCm: data.heightCm,
          goal: data.goal,
          activityLevel: data.activityLevel,
          insulinSens: 'normal',
          dietPreset: 'flexible',
          usingHormones: false,
          baseKcal: data.baseKcal,
          cheatKcal: data.cheatKcal,
          proteinGoalG: data.proteinGoalG,
          carbGoalG: data.carbGoalG,
          fatGoalG: data.fatGoalG,
        },
      },
    },
    include: { profile: true },
  });

  // Marca convite como usado
  await prisma.invite.update({
    where: { token: data.token },
    data: { usedAt: new Date(), usedByEmail: data.email },
  });

  // Cria sessão
  await createSession({
    accountId: account.id,
    role: 'client',
    userId: account.profile!.id,
  });

  redirect('/');
}
