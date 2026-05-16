'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveLabResult(data: Record<string, unknown> & { userId: string; date: string }) {
  const { userId, date, notes, ...rest } = data;

  const numericFields = [
    'testTotal', 'testFree', 'estradiol', 'dht', 'lh', 'fsh', 'prolactin', 'shbg',
    'hematocrit', 'hemoglobin', 'glucoseFasting', 'insulinFasting', 'hba1c',
    'totalChol', 'ldl', 'hdl', 'triglycerides',
    'ast', 'alt', 'ggt', 'urea', 'creatinine', 'psa',
    'tsh', 't4Free', 't3Free',
  ];

  const payload: Record<string, unknown> = {
    userId,
    date: new Date((date as string) + 'T12:00:00'),
    notes: notes ?? null,
  };

  for (const field of numericFields) {
    payload[field] = rest[field] != null && rest[field] !== '' ? Number(rest[field]) : null;
  }

  await prisma.labResult.create({ data: payload as Parameters<typeof prisma.labResult.create>[0]['data'] });
  revalidatePath('/exames');
  revalidatePath('/');
}
