'use server';

import { prisma } from '@/lib/db';
import type { ActivityLevel, Goal, DietPreset, InsulinSensitivity } from '@/lib/nutrition';

interface ProfileData {
  name: string;
  birthDate: string;
  sex: string;
  heightCm: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  insulinSens: InsulinSensitivity;
  dietPreset: DietPreset;
  usingHormones: boolean;
  baseKcal: number;
  cheatKcal: number;
  proteinGoalG: number;
  carbGoalG: number;
  fatGoalG: number;
  weightKg: number;
  bodyFatPct: number | null;
}

export async function saveProfile(data: ProfileData) {
  const existing = await prisma.user.findFirst();

  const payload = {
    name: data.name,
    birthDate: new Date(data.birthDate),
    sex: data.sex,
    heightCm: data.heightCm,
    goal: data.goal,
    activityLevel: data.activityLevel,
    insulinSens: data.insulinSens,
    dietPreset: data.dietPreset,
    usingHormones: data.usingHormones,
    baseKcal: data.baseKcal,
    cheatKcal: data.cheatKcal,
    proteinGoalG: data.proteinGoalG,
    carbGoalG: data.carbGoalG,
    fatGoalG: data.fatGoalG,
  };

  let user;
  if (existing) {
    user = await prisma.user.update({ where: { id: existing.id }, data: payload });
  } else {
    user = await prisma.user.create({ data: payload });
  }

  // Salva medida inicial se peso foi informado
  if (data.weightKg > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasToday = await prisma.measurement.findFirst({
      where: { userId: user.id, date: { gte: today } },
    });

    if (!hasToday) {
      await prisma.measurement.create({
        data: {
          userId: user.id,
          weightKg: data.weightKg,
          bodyFatPct: data.bodyFatPct ?? undefined,
        },
      });
    }
  }

  return user;
}
