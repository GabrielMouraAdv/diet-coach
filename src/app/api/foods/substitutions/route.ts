import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { substituteGrams } from '@/lib/nutrition';

export async function GET(req: NextRequest) {
  const foodId = req.nextUrl.searchParams.get('foodId');
  const gramsA = parseFloat(req.nextUrl.searchParams.get('gramsA') ?? '100');
  if (!foodId) return NextResponse.json([]);

  const food = await prisma.food.findUnique({ where: { id: foodId } });
  if (!food) return NextResponse.json([]);

  // Busca substituições do nosso catálogo por externalId
  const { SUBSTITUTION_PAIRS } = await import('@/lib/presets/substitutions');
  const pairs = SUBSTITUTION_PAIRS.filter(p => p.foodAExternalId === food.externalId);

  const results = await Promise.all(
    pairs.map(async (p) => {
      const foodB = await prisma.food.findFirst({ where: { externalId: p.foodBExternalId } });
      if (!foodB) return null;
      const gramsNeeded = Math.round((gramsA / p.gramsA) * p.gramsB);
      return { ...foodB, gramsNeeded, basis: p.basis, note: p.note };
    })
  );

  // Fallback: busca alimentos semelhantes por categoria com proteína similar
  const filtered = results.filter(Boolean);
  if (filtered.length === 0) {
    const similar = await prisma.food.findMany({
      where: { category: food.category, id: { not: food.id } },
      take: 5,
    });
    return NextResponse.json(similar.map(b => ({
      ...b,
      gramsNeeded: substituteGrams({
        foodA: { kcal: food.kcal, protein: food.protein, carb: food.carb, fat: food.fat },
        foodB: { kcal: b.kcal, protein: b.protein, carb: b.carb, fat: b.fat },
        gramsA,
        basis: 'protein',
      }),
      basis: 'protein',
    })));
  }

  return NextResponse.json(filtered);
}
