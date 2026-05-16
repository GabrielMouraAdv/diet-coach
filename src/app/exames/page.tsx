import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ExamesClient } from './ExamesClient';

export const dynamic = 'force-dynamic';

export default async function ExamesPage() {
  const user = await prisma.user.findFirst();
  if (!user) redirect('/perfil');

  const labs = await prisma.labResult.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    take: 20,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Exames</h1>
      <p className="text-sm text-ink-400 mb-6">Hormônios, hemograma, lipídeos — com alertas automáticos.</p>
      <ExamesClient userId={user.id} labs={labs} />
    </div>
  );
}
