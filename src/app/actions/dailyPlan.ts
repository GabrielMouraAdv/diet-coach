'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface ToggleArgs {
  userId: string;
  date: string;
  isCheat: boolean;
  planId?: string;
  cheatKcal: number;
  baseKcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
}

export async function toggleCheatDay(args: ToggleArgs) {
  const { userId, date, isCheat, planId, cheatKcal, baseKcal, proteinG, carbG, fatG } = args;
  const newIsCheat = !isCheat;
  const kcalTarget = newIsCheat ? cheatKcal : baseKcal;
  const delta = newIsCheat ? cheatKcal - baseKcal : 0;

  const data = {
    isCheatDay: newIsCheat,
    kcalTarget,
    proteinG,
    carbG,
    fatG,
    delta,
    notes: newIsCheat ? 'Dia lixo programado' : null,
  };

  if (planId) {
    await prisma.dailyPlan.update({ where: { id: planId }, data });
  } else {
    await prisma.dailyPlan.upsert({
      where: { date: new Date(date) },
      create: { userId, date: new Date(date), ...data },
      update: data,
    });
  }

  revalidatePath('/');
}
