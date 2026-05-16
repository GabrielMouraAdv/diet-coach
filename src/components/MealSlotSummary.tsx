import type { Meal, MealItem, Food } from '@prisma/client';

type MealWithItems = Meal & { items: (MealItem & { food: Food })[] };

const SLOT_LABELS: Record<string, string> = {
  breakfast: '☀️ Café da manhã',
  snack1:    '🍎 Lanche 1',
  lunch:     '🍽️ Almoço',
  snack2:    '🥜 Lanche 2',
  dinner:    '🌙 Jantar',
  supper:    '🌜 Ceia',
  cheat:     '🍕 Refeição lixo',
};

export function MealSlotSummary({ meal }: { meal: MealWithItems }) {
  let kcal = 0;
  let protein = 0;
  for (const item of meal.items) {
    const f = item.grams / 100;
    kcal += item.food.kcal * f;
    protein += item.food.protein * f;
  }

  return (
    <div className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
      <div>
        <p className="font-medium">{SLOT_LABELS[meal.slot] ?? meal.slot}</p>
        <p className="text-xs text-ink-400">
          {meal.items.length} item(ns)
          {meal.items.length > 0 && ` · P: ${Math.round(protein)}g`}
        </p>
      </div>
      <span className="font-semibold text-ink-700">{Math.round(kcal)} kcal</span>
    </div>
  );
}
