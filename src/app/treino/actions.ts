'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function deleteWorkout(id: string) {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHORIZED');
  // Verifica que o treino pertence ao usuário (proteção)
  const w = await prisma.workout.findUnique({ where: { id }, select: { userId: true } });
  if (!w) throw new Error('NOT_FOUND');
  const user = await prisma.user.findUnique({ where: { accountId: session.accountId } });
  if (!user || w.userId !== user.id) throw new Error('FORBIDDEN');
  await prisma.workout.delete({ where: { id } });
  revalidatePath('/treino');
}
