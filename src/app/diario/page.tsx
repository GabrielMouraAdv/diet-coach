import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { DiarioClient } from './DiarioClient';
import { getSession } from '@/lib/auth';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function DiarioPage({ searchParams }: { searchParams: Promise<{ data?: string }> }) {
  const session = await getSession();
  if (!session) redirect('/login');
  const user = await prisma.user.findUnique({ where: { accountId: session.accountId } });
  if (!user) redirect('/perfil');

  const { data } = await searchParams;
  const dateStr = data ?? format(new Date(), 'yyyy-MM-dd');
  const date = new Date(dateStr + 'T00:00:00');
  const dateEnd = new Date(date); dateEnd.setDate(dateEnd.getDate() + 1);

  const [meals, plan] = await Promise.all([
    prisma.meal.findMany({
      where: { userId: user.id, date: { gte: date, lt: dateEnd } },
      include: { items: { include: { food: true } } },
      orderBy: { slot: 'asc' },
    }),
    prisma.dailyPlan.findFirst({ where: { userId: user.id, date: { gte: date, lt: dateEnd } } }),
  ]);

  const kcalTarget = plan?.isCheatDay ? user.cheatKcal : user.baseKcal;

  return (
    <DiarioClient
      userId={user.id}
      date={dateStr}
      meals={meals as Parameters<typeof DiarioClient>[0]['meals']}
      kcalTarget={kcalTarget}
      proteinTarget={user.proteinGoalG}
      carbTarget={user.carbGoalG}
      fatTarget={user.fatGoalG}
      isCheat={plan?.isCheatDay ?? false}
    />
  );
}
