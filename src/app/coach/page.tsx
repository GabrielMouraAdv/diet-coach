export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { CoachChat } from './CoachChat';
import { getSession } from '@/lib/auth';

export default async function CoachPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const user = await prisma.user.findUnique({ where: { accountId: session.accountId } });
  if (!user) redirect('/perfil');
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)]">
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-2xl font-bold">Coach IA 🤖</h1>
        <p className="text-sm text-ink-400">
          Cardápios, substituições, treinos e análises — baseados nos seus dados e nos protocolos de Haluch.
          Modelo: <span className="font-mono text-xs">claude-haiku-4-5</span>
        </p>
      </div>
      <CoachChat userName={user.name.split(' ')[0]} />
    </div>
  );
}
