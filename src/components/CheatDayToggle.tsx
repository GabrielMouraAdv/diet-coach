'use client';

import { useTransition } from 'react';
import { toggleCheatDay } from '@/app/actions/dailyPlan';

interface Props {
  userId: string;
  date: string;
  isCheat: boolean;
  planId?: string;
  cheatKcal: number;
  baseKcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
}

export function CheatDayToggle({ userId, date, isCheat, planId, cheatKcal, baseKcal, proteinG, carbG, fatG }: Props) {
  const [pending, start] = useTransition();

  const handleToggle = () => {
    start(async () => {
      await toggleCheatDay({ userId, date, isCheat, planId, cheatKcal, baseKcal, proteinG, carbG, fatG });
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      title={isCheat ? 'Voltar para dieta normal' : 'Ativar dia lixo (+600 kcal)'}
      className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium border transition-colors
        ${isCheat
          ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
          : 'bg-ink-50 border-ink-200 text-ink-600 hover:bg-ink-100'
        } ${pending ? 'opacity-50' : ''}`}
    >
      <span className="text-xl">{isCheat ? '🍕' : '🥗'}</span>
      <span>{isCheat ? 'Dia lixo' : 'Normal'}</span>
    </button>
  );
}
