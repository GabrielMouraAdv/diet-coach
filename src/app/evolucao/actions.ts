'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveMeasurement(data: {
  userId: string; date: string; weightKg: number;
  bodyFatPct?: number | null; waistCm?: number | null; hipCm?: number | null;
  chestCm?: number | null; armCm?: number | null; thighCm?: number | null; notes?: string;
}) {
  await prisma.measurement.create({
    data: {
      userId: data.userId,
      date: new Date(data.date + 'T12:00:00'),
      weightKg: data.weightKg,
      bodyFatPct: data.bodyFatPct ?? null,
      waistCm: data.waistCm ?? null,
      hipCm: data.hipCm ?? null,
      chestCm: data.chestCm ?? null,
      armCm: data.armCm ?? null,
      thighCm: data.thighCm ?? null,
      notes: data.notes || null,
    },
  });
  revalidatePath('/evolucao');
  revalidatePath('/');
}
