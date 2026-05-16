import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (q.length < 2) return NextResponse.json([]);

  const foods = await prisma.food.findMany({
    where: { name: { contains: q } },
    orderBy: { name: 'asc' },
    take: 20,
  });

  return NextResponse.json(foods);
}
