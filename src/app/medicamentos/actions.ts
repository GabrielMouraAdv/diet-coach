'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveMedication(data: {
  userId: string; name: string; category: string; doseAmount: number; doseUnit: string;
  frequency: string; weekday: number; timeOfDay: string; startDate: string; notes: string;
}) {
  const med = await prisma.medication.create({
    data: {
      userId: data.userId, name: data.name, category: data.category,
      doseAmount: data.doseAmount, doseUnit: data.doseUnit,
      frequency: data.frequency, weekday: data.weekday, timeOfDay: data.timeOfDay,
      startDate: new Date(data.startDate), notes: data.notes,
    },
  });
  revalidatePath('/medicamentos');
  revalidatePath('/');
  return med;
}

export async function logMedication(data: {
  userId: string; medicationId: string; doseAmount: number; doseUnit: string;
  sideEffects: string; notes: string;
}) {
  const log = await prisma.medicationLog.create({
    data: {
      userId: data.userId, medicationId: data.medicationId,
      doseAmount: data.doseAmount, doseUnit: data.doseUnit,
      sideEffects: data.sideEffects || null, notes: data.notes || null,
    },
  });
  revalidatePath('/medicamentos');
  revalidatePath('/');
  return log;
}

export async function toggleMedicationActive(id: string, active: boolean) {
  await prisma.medication.update({ where: { id }, data: { active } });
  revalidatePath('/medicamentos');
}
