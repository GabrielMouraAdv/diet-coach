'use server';

import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function scheduleConsultation(data: {
  userId: string;
  scheduledAt: string; // ISO ou yyyy-MM-ddTHH:mm
  type: 'inicial' | 'retorno' | 'ajuste' | 'avaliacao';
  notes?: string;
}) {
  const admin = await requireAdmin();
  const consultation = await prisma.consultation.create({
    data: {
      userId: data.userId,
      scheduledAt: new Date(data.scheduledAt),
      type: data.type,
      notes: data.notes || null,
      createdById: admin.accountId,
    },
  });
  revalidatePath('/admin');
  revalidatePath(`/admin/cliente/${data.userId}`);
  return consultation;
}

export async function completeConsultation(id: string, notes?: string) {
  await requireAdmin();
  const c = await prisma.consultation.update({
    where: { id },
    data: { completedAt: new Date(), notes: notes ?? undefined },
  });
  revalidatePath('/admin');
  revalidatePath(`/admin/cliente/${c.userId}`);
  return c;
}

export async function deleteConsultation(id: string) {
  await requireAdmin();
  const c = await prisma.consultation.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath(`/admin/cliente/${c.userId}`);
}

export async function updateConsultation(id: string, data: {
  scheduledAt?: string;
  notes?: string;
  type?: 'inicial' | 'retorno' | 'ajuste' | 'avaliacao';
}) {
  await requireAdmin();
  const c = await prisma.consultation.update({
    where: { id },
    data: {
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      type: data.type,
      notes: data.notes,
    },
  });
  revalidatePath('/admin');
  revalidatePath(`/admin/cliente/${c.userId}`);
  return c;
}
