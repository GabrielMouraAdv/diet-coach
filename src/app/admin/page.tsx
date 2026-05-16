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

  const clients = await prisma.user.findMany({
    include: {
      account: { select: { email: true, createdAt: true } },
      measurements: { orderBy: { date: 'desc' }, take: 1 },
    },
    orderBy: { account: { createdAt: 'desc' } },
  });

  const pendingInvites = await prisma.invite.findMany({
    where: { usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  return <AdminDashboard clients={clients as Parameters<typeof AdminDashboard>[0]['clients']} pendingInvites={pendingInvites} />;
}
