'use server';

import { prisma } from '@/lib/db';
import { getSession, createSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
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
  const session = await getSession();
  if (!session) redirect('/login');

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

  const existing = await prisma.user.findUnique({ where: { accountId: session.accountId } });

  let user;
  if (existing) {
    user = await prisma.user.update({ where: { id: existing.id }, data: payload });
  } else {
    // Cria perfil vinculado à conta (ex: admin criando seu próprio perfil)
    user = await prisma.user.create({
      data: { ...payload, accountId: session.accountId },
    });
    // Atualiza o userId na sessão
    await createSession({ ...session, userId: user.id });
  }

  // Salva medida inicial se peso informado
  if (data.weightKg > 0) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const hasToday = await prisma.measurement.findFirst({
      where: { userId: user.id, date: { gte: today } },
    });
    if (!hasToday) {
      await prisma.measurement.create({
        data: { userId: user.id, weightKg: data.weightKg, bodyFatPct: data.bodyFatPct ?? null },
      });
    }
  }

  return user;
}
