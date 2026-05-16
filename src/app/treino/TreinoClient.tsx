'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Workout, WorkoutSet } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronDown, ChevronUp, Trash2, Dumbbell, Bot } from 'lucide-react';
import { deleteWorkout } from './actions';

type WorkoutWithSets = Workout & { sets: WorkoutSet[] };

interface Props { userId: string; workouts: WorkoutWithSets[]; }

export function TreinoClient({ workouts }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm('Excluir este treino?')) return;
    start(async () => {
      await deleteWorkout(id);
      router.refresh();
    });
  };

  // Agrupa séries por exercício
  const groupSets = (sets: WorkoutSet[]) => {
    const groups: Record<string, WorkoutSet[]> = {};
    for (const s of sets) {
      if (!groups[s.exercise]) groups[s.exercise] = [];
      groups[s.exercise].push(s);
    }
    return groups;
  };

  return (
    <div className="space-y-4">
      {workouts.length === 0 ? (
        <div className="card text-center py-12">
          <Dumbbell size={32} className="mx-auto text-ink-300 mb-3" />
          <p className="font-semibold mb-1">Nenhum treino ainda</p>
          <p className="text-sm text-ink-400 mb-4">Use o Coach IA para gerar treinos personalizados baseados no seu objetivo.</p>
          <Link href="/coach" className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Bot size={16} /> Pedir treino ao Coach
          </Link>
        </div>
      ) : (
        <>
          <div className="card flex items-center justify-between bg-brand-50 border-brand-200">
            <div>
              <p className="font-semibold text-brand-700 text-sm">💡 Quer um novo treino?</p>
              <p className="text-xs text-ink-500">Peça ao Coach IA — ele gera e salva aqui automaticamente.</p>
            </div>
            <Link href="/coach" className="btn-primary text-xs px-3 py-2 flex items-center gap-1">
              <Bot size={14} /> Coach
            </Link>
          </div>

          {workouts.map(w => {
            const isOpen = expanded === w.id;
            const groups = groupSets(w.sets);
            return (
              <div key={w.id} className="card p-0 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <button onClick={() => setExpanded(isOpen ? null : w.id)} className="flex-1 text-left">
                    <p className="font-medium text-sm">{w.name}</p>
                    <p className="text-xs text-ink-400">
                      {format(new Date(w.date), "EEE, dd 'de' MMM", { locale: ptBR })}
                      {' · '}{w.sets.length} série{w.sets.length > 1 ? 's' : ''}
                      {w.duration && ` · ${w.duration} min`}
                    </p>
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDelete(w.id)} disabled={pending} title="Excluir" className="p-1.5 rounded hover:bg-red-50 text-red-400">
                      <Trash2 size={14} />
                    </button>
                    <button onClick={() => setExpanded(isOpen ? null : w.id)} className="p-1 text-ink-400">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t px-4 py-3 space-y-3">
                    {Object.entries(groups).map(([exercise, sets]) => (
                      <div key={exercise}>
                        <p className="font-medium text-sm mb-1">{exercise}</p>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          {sets.map(s => (
                            <div key={s.id} className="bg-ink-50 rounded-lg p-2 text-center">
                              <p className="text-ink-400 text-[10px]">Série {s.setNumber}</p>
                              <p className="font-bold">{s.reps} reps</p>
                              {s.loadKg != null && <p className="text-xs text-ink-600">{s.loadKg} kg</p>}
                              {s.rir != null && <p className="text-[10px] text-ink-400">RIR {s.rir}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {w.notes && (
                      <p className="text-xs text-ink-500 italic border-t pt-2">{w.notes}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
