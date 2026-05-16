import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { ClientDetail } from './ClientDetail';

export const dynamic = 'force-dynamic';

export default async function AdminClientPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    redirect('/login');
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      account: { select: { email: true, createdAt: true } },
      measurements: { orderBy: { date: 'desc' }, take: 30 },
      medications: { where: { active: true }, include: { logs: { orderBy: { takenAt: 'desc' }, take: 5 } } },
      labResults: { orderBy: { date: 'desc' }, take: 5 },
      meals: {
        orderBy: { date: 'desc' },
        take: 30,
        include: { items: { include: { food: true } } },
      },
    },
  });

  if (!user) return notFound();

  return <ClientDetail user={user as Parameters<typeof ClientDetail>[0]['user']} />;
}
