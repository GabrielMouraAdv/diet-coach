import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { EvolucaoClient } from './EvolucaoClient';

export const dynamic = 'force-dynamic';

export default async function EvolucaoPage() {
  const user = await prisma.user.findFirst();
  if (!user) redirect('/perfil');

  const measurements = await prisma.measurement.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    take: 90,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Evolução</h1>
      <p className="text-sm text-ink-400 mb-6">Peso, medidas e composição corporal.</p>
      <EvolucaoClient userId={user.id} measurements={measurements} />
    </div>
  );
}
