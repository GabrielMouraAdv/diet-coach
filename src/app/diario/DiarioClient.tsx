'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Meal, MealItem, Food } from '@prisma/client';
import { macrosForGrams, substituteGrams } from '@/lib/nutrition';
import { addMealItem, removeMealItem, createMeal } from './actions';
import { ChevronDown, ChevronUp, Trash2, RefreshCw, Plus } from 'lucide-react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

type MealWithItems = Meal & { items: (MealItem & { food: Food })[] };

const SLOTS = [
  { key: 'breakfast', label: '☀️ Café da manhã' },
  { key: 'snack1',    label: '🍎 Lanche 1' },
  { key: 'lunch',     label: '🍽️ Almoço' },
  { key: 'snack2',    label: '🥜 Lanche 2' },
  { key: 'dinner',    label: '🌙 Jantar' },
  { key: 'supper',    label: '🌜 Ceia' },
  { key: 'cheat',     label: '🍕 Refeição lixo' },
];

interface Props {
  userId: string;
  date: string;
  meals: MealWithItems[];
  kcalTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  isCheat: boolean;
}

export function DiarioClient({ userId, date, meals, kcalTarget, proteinTarget, carbTarget, fatTarget, isCheat }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [openSlot, setOpenSlot] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [searching, setSearching] = useState(false);
  const [grams, setGrams] = useState('100');
  const [addingSlot, setAddingSlot] = useState<string | null>(null);
  // substituição
  const [subFood, setSubFood] = useState<Food | null>(null);
  const [subResults, setSubResults] = useState<(Food & { gramsNeeded: number })[]>([]);

  const parsed = parseISO(date);
  const prevDate = format(subDays(parsed, 1), 'yyyy-MM-dd');
  const nextDate = format(addDays(parsed, 1), 'yyyy-MM-dd');

  // Totais do dia
  let totKcal = 0, totProt = 0, totCarb = 0, totFat = 0;
  for (const meal of meals) {
    for (const item of meal.items) {
      const m = macrosForGrams(item.food, item.grams);
      totKcal += m.kcal; totProt += m.protein; totCarb += m.carb; totFat += m.fat;
    }
  }

  const searchFood = async (q: string) => {
    setSearch(q);
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    const res = await fetch(`/api/foods?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
    setSearching(false);
  };

  const handleAddItem = (food: Food, slot: string) => {
    const g = parseFloat(grams) || 100;
    start(async () => {
      let meal = meals.find(m => m.slot === slot);
      if (!meal) {
        await createMeal({ userId, date, slot });
        router.refresh();
        return;
      }
      await addMealItem({ mealId: meal.id, foodId: food.id, grams: g });
      setSearch(''); setResults([]); setAddingSlot(null);
      router.refresh();
    });
  };

  const handleRemoveItem = (itemId: string) => {
    start(async () => {
      await removeMealItem(itemId);
      router.refresh();
    });
  };

  const showSubstitutions = async (food: Food) => {
    setSubFood(food);
    const res = await fetch(`/api/foods/substitutions?foodId=${food.id}&gramsA=100`);
    const data = await res.json();
    setSubResults(data);
  };

  const getMealBySlot = (slot: string) => meals.find(m => m.slot === slot);

  return (
    <div className="space-y-4">
      {/* Navegação de data */}
      <div className="flex items-center justify-between">
        <Link href={`/diario?data=${prevDate}`} className="btn-ghost px-3 py-2">←</Link>
        <div className="text-center">
          <p className="text-sm text-ink-400">Diário alimentar</p>
          <p className="font-semibold">{format(parsed, "dd 'de' MMMM", { locale: ptBR })}</p>
        </div>
        <Link href={`/diario?data=${nextDate}`} className="btn-ghost px-3 py-2">→</Link>
      </div>

      {/* Totais do dia */}
      <div className="card grid grid-cols-4 gap-2 text-center">
        {[
          { label: 'Kcal', val: Math.round(totKcal), target: kcalTarget, color: 'text-brand-600' },
          { label: 'Prot', val: Math.round(totProt), target: proteinTarget, color: 'text-blue-600' },
          { label: 'Carb', val: Math.round(totCarb), target: carbTarget, color: 'text-yellow-600' },
          { label: 'Gord', val: Math.round(totFat), target: fatTarget, color: 'text-red-500' },
        ].map(({ label, val, target, color }) => (
          <div key={label}>
            <p className={`text-lg font-bold ${color}`}>{val}</p>
            <p className="text-xs text-ink-400">{label} / {target}</p>
            <div className="macro-bar mt-1">
              <div className="macro-bar-fill bg-current" style={{ width: `${Math.min(100, (val/target)*100)}%`, color: 'inherit' }} />
            </div>
          </div>
        ))}
      </div>

      {isCheat && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          🍕 <strong>Dia lixo:</strong> meta {kcalTarget} kcal — aproveite estrategicamente!
          <br /><span className="text-xs">Protocolo Haluch: concentre a refeição lixo no pós-treino mais pesado.</span>
        </div>
      )}

      {/* Slots de refeição */}
      {SLOTS.map(({ key, label }) => {
        const meal = getMealBySlot(key);
        const isOpen = openSlot === key;

        let slotKcal = 0;
        if (meal) for (const item of meal.items) slotKcal += macrosForGrams(item.food, item.grams).kcal;

        return (
          <div key={key} className="card p-0 overflow-hidden">
            {/* Header do slot */}
            <button
              onClick={() => setOpenSlot(isOpen ? null : key)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-ink-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{label}</span>
                {meal && meal.items.length > 0 && (
                  <span className="badge bg-ink-100 text-ink-600">{Math.round(slotKcal)} kcal</span>
                )}
              </div>
              {isOpen ? <ChevronUp size={16} className="text-ink-400" /> : <ChevronDown size={16} className="text-ink-400" />}
            </button>

            {isOpen && (
              <div className="border-t px-4 py-3 space-y-3">
                {/* Itens */}
                {meal?.items.map(item => {
                  const m = macrosForGrams(item.food, item.grams);
                  return (
                    <div key={item.id} className="flex items-center gap-2 text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.food.name}</p>
                        <p className="text-xs text-ink-400">
                          {item.grams}g · {Math.round(m.kcal)} kcal · P{Math.round(m.protein)}g C{Math.round(m.carb)}g G{Math.round(m.fat)}g
                        </p>
                      </div>
                      <button onClick={() => showSubstitutions(item.food)} title="Sugestão de substituição" className="p-1 rounded hover:bg-ink-100 text-ink-400">
                        <RefreshCw size={14} />
                      </button>
                      <button onClick={() => handleRemoveItem(item.id)} title="Remover" className="p-1 rounded hover:bg-red-50 text-red-400" disabled={pending}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}

                {/* Substituições */}
                {subFood && subResults.length > 0 && (
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-blue-700">Substituições para {subFood.name}:</p>
                      <button onClick={() => { setSubFood(null); setSubResults([]); }} className="text-xs text-ink-400">✕</button>
                    </div>
                    {subResults.slice(0, 4).map((r, i) => (
                      <p key={i} className="text-xs text-blue-800">
                        → <strong>{r.gramsNeeded}g de {r.name}</strong> (equivalente em proteína)
                      </p>
                    ))}
                  </div>
                )}

                {/* Adicionar item */}
                {addingSlot === key ? (
                  <div className="space-y-2">
                    <input
                      className="input text-sm"
                      placeholder="Buscar alimento... (ex: frango, arroz)"
                      value={search}
                      onChange={e => searchFood(e.target.value)}
                      autoFocus
                    />
                    <input
                      className="input text-sm"
                      type="number"
                      placeholder="Gramas"
                      value={grams}
                      onChange={e => setGrams(e.target.value)}
                      min={1}
                      step={5}
                    />
                    {searching && <p className="text-xs text-ink-400">Buscando...</p>}
                    {results.map(food => {
                      const m = macrosForGrams(food, parseFloat(grams) || 100);
                      return (
                        <button
                          key={food.id}
                          onClick={() => handleAddItem(food, key)}
                          disabled={pending}
                          className="w-full text-left rounded-lg px-3 py-2 hover:bg-brand-50 border border-ink-100 text-sm transition-colors"
                        >
                          <p className="font-medium">{food.name}</p>
                          <p className="text-xs text-ink-400">
                            {Math.round(m.kcal)} kcal · P{Math.round(m.protein)}g C{Math.round(m.carb)}g G{Math.round(m.fat)}g
                          </p>
                        </button>
                      );
                    })}
                    <button onClick={() => { setAddingSlot(null); setSearch(''); setResults([]); }} className="text-xs text-ink-400">Cancelar</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingSlot(key)}
                    className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    <Plus size={15} /> Adicionar alimento
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
