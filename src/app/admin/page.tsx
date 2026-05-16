import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminDashboard } from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/login');
  }

  const now = new Date();

  const [clients, pendingInvites, upcomingConsultations] = await Promise.all([
    prisma.user.findMany({
      include: {
        account: { select: { email: true, createdAt: true } },
        measurements: { orderBy: { date: 'desc' }, take: 1 },
        consultations: {
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { account: { createdAt: 'desc' } },
    }),
    prisma.invite.findMany({
      where: { usedAt: null, expiresAt: { gt: now } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.consultation.findMany({
      where: { completedAt: null, scheduledAt: { gte: now } },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { scheduledAt: 'asc' },
      take: 20,
    }),
  ]);

  return (
    <AdminDashboard
      clients={clients as Parameters<typeof AdminDashboard>[0]['clients']}
      pendingInvites={pendingInvites}
      upcomingConsultations={upcomingConsultations as Parameters<typeof AdminDashboard>[0]['upcomingConsultations']}
    />
  );
}
