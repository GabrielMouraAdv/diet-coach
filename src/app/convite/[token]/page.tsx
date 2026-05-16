import { prisma } from '@/lib/db';
import { ConviteForm } from './ConviteForm';
import { notFound } from 'next/navigation';

export default async function ConvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const invite = await prisma.invite.findUnique({ where: { token } });

  if (!invite) return notFound();

  const expired = new Date() > new Date(invite.expiresAt);
  const used = !!invite.usedAt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🥗</span>
          <h1 className="text-2xl font-bold text-ink-800 mt-3">Diet Coach</h1>
          {!expired && !used && invite.clientName && (
            <p className="text-ink-500 mt-1">Olá, <strong>{invite.clientName}</strong>! Crie sua conta.</p>
          )}
        </div>

        {used ? (
          <div className="card text-center">
            <span className="text-4xl">✅</span>
            <p className="font-semibold mt-2">Convite já utilizado</p>
            <p className="text-sm text-ink-400 mt-1">Esta conta já foi criada.</p>
            <a href="/login" className="btn-primary mt-4 inline-block px-6 py-2 text-sm">Fazer login</a>
          </div>
        ) : expired ? (
          <div className="card text-center">
            <span className="text-4xl">⏰</span>
            <p className="font-semibold mt-2">Convite expirado</p>
            <p className="text-sm text-ink-400 mt-1">Solicite um novo link ao seu coach.</p>
          </div>
        ) : (
          <div className="card">
            <ConviteForm
              token={token}
              defaultName={invite.clientName ?? ''}
              defaultEmail={invite.clientEmail ?? ''}
            />
          </div>
        )}
      </div>
    </div>
  );
}
