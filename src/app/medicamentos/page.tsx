import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { MedicamentosClient } from './MedicamentosClient';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function MedicamentosPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const user = await prisma.user.findUnique({ where: { accountId: session.accountId } });
  if (!user) redirect('/perfil');

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today); todayEnd.setDate(todayEnd.getDate() + 1);

  const medications = await prisma.medication.findMany({
    where: { userId: user.id },
    include: {
      logs: {
        orderBy: { takenAt: 'desc' },
        take: 10,
      },
    },
    orderBy: { active: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Medicamentos</h1>
      </div>
      <p className="text-sm text-ink-400 mb-6">Rastreie Mounjaro, hormônios e suplementos.</p>
      <MedicamentosClient userId={user.id} medications={medications as Parameters<typeof MedicamentosClient>[0]['medications']} todayStr={today.toISOString()} />
    </div>
  );
}
