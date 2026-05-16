'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createMeal(data: { userId: string; date: string; slot: string }) {
  const meal = await prisma.meal.create({
    data: { userId: data.userId, date: new Date(data.date + 'T00:00:00'), slot: data.slot },
  });
  revalidatePath('/diario');
  return meal;
}

export async function addMealItem(data: { mealId: string; foodId: string; grams: number }) {
  const item = await prisma.mealItem.create({ data });
  revalidatePath('/diario');
  revalidatePath('/');
  return item;
}

export async function removeMealItem(id: string) {
  await prisma.mealItem.delete({ where: { id } });
  revalidatePath('/diario');
  revalidatePath('/');
}
