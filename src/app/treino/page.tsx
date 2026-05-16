import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { TreinoClient } from './TreinoClient';

export const dynamic = 'force-dynamic';

export default async function TreinoPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const user = await prisma.user.findUnique({ where: { accountId: session.accountId } });
  if (!user) redirect('/perfil');

  const workouts = await prisma.workout.findMany({
    where: { userId: user.id },
    include: { sets: { orderBy: { setNumber: 'asc' } } },
    orderBy: { date: 'desc' },
    take: 30,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Treinos</h1>
      <p className="text-sm text-ink-400 mb-6">Seus últimos treinos. Use o Coach IA para gerar novos.</p>
      <TreinoClient userId={user.id} workouts={workouts as Parameters<typeof TreinoClient>[0]['workouts']} />
    </div>
  );
}
