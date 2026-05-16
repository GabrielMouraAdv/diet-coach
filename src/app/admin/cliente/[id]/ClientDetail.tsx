'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User, Account, Measurement, Medication, MedicationLog, LabResult, Meal, MealItem, Food, Consultation } from '@prisma/client';
import { format, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft, User as UserIcon, Pill, Scale, FlaskConical, UtensilsCrossed, Target,
  Calendar, CalendarPlus, Check, Trash2,
} from 'lucide-react';
import { yearsBetween, calcBMR, calcTDEE, detectHormonalProfile, calcHormonalBMRMultiplier } from '@/lib/nutrition';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SIDE_EFFECT_LABELS } from '@/lib/presets/medications';
import { scheduleConsultation, completeConsultation, deleteConsultation } from '@/app/actions/consultations';

type ClientWithData = User & {
  account: Pick<Account, 'email' | 'createdAt'>;
  measurements: Measurement[];
  medications: (Medication & { logs: MedicationLog[] })[];
  labResults: LabResult[];
  meals: (Meal & { items: (MealItem & { food: Food })[] })[];
  consultations: Consultation[];
};

interface Props { user: ClientWithData; }

export function ClientDetail({ user }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(format(addDays(new Date(), 30), "yyyy-MM-dd'T'HH:mm"));
  const [scheduleType, setScheduleType] = useState<'inicial' | 'retorno' | 'ajuste' | 'avaliacao'>('retorno');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [editNotesId, setEditNotesId] = useState<string | null>(null);
  const [completeNotes, setCompleteNotes] = useState('');

  const handleSchedule = () => {
    start(async () => {
      await scheduleConsultation({ userId: user.id, scheduledAt: scheduleDate, type: scheduleType, notes: scheduleNotes });
      setShowSchedule(false); setScheduleNotes('');
      router.refresh();
    });
  };

  const handleComplete = (id: string) => {
    start(async () => {
      await completeConsultation(id, completeNotes || undefined);
      setEditNotesId(null); setCompleteNotes('');
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Excluir esta consulta?')) return;
    start(async () => {
      await deleteConsultation(id);
      router.refresh();
    });
  };

  const now = new Date();
  const upcomingConsults  = user.consultations.filter(c => !c.completedAt && new Date(c.scheduledAt) >= now);
  const pastConsults      = user.consultations.filter(c => c.completedAt).sort((a, b) => +new Date(b.completedAt!) - +new Date(a.completedAt!));
  const lastConsult       = pastConsults[0];
  const nextConsult       = upcomingConsults.sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))[0];

  const age = yearsBetween(new Date(user.birthDate));
  const latest = user.measurements[0];
  const previous = user.measurements[1];

  // BMR/TDEE com ajuste hormonal
  let bmrText = '—';
  let tdeeText = '—';
  let hormonalNote = '';
  if (latest) {
    const { value: bmrRaw, method } = calcBMR({
      weightKg: latest.weightKg,
      heightCm: user.heightCm,
      ageYears: age,
      sex: user.sex as 'M' | 'F',
      bodyFatPct: latest.bodyFatPct,
    });
    const profile = detectHormonalProfile(user.medications.map(m => m.name));
    const { multiplier, note } = calcHormonalBMRMultiplier(profile);
    const bmr = Math.round(bmrRaw * multiplier);
    bmrText = `${bmr} kcal (${method === 'katch' ? 'Katch' : 'Mifflin'}${multiplier !== 1 ? ` ×${multiplier}` : ''})`;
    tdeeText = `${Math.round(calcTDEE(bmr, user.activityLevel as Parameters<typeof calcTDEE>[1]))} kcal`;
    hormonalNote = note;
  }

  // Chart data
  const weightChart = [...user.measurements].reverse().map(m => ({
    date: format(new Date(m.date), 'dd/MM'),
    peso: m.weightKg,
    bf: m.bodyFatPct ?? null,
  }));

  // Agrupar refeições por dia
  const mealsByDay = user.meals.reduce((acc, meal) => {
    const dayKey = format(new Date(meal.date), 'yyyy-MM-dd');
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(meal);
    return acc;
  }, {} as Record<string, typeof user.meals>);

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-4 py-3 flex items-center gap-3">
        <Link href="/admin" className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{user.name}</p>
          <p className="text-xs text-ink-400 truncate">{user.account.email}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Perfil resumido */}
        <section className="card space-y-3">
          <h2 className="font-semibold text-sm flex items-center gap-2"><UserIcon size={15} /> Perfil</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-ink-400">Idade</p>
              <p className="font-medium">{age} anos</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Sexo</p>
              <p className="font-medium">{user.sex === 'M' ? 'Masculino' : 'Feminino'}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Altura</p>
              <p className="font-medium">{user.heightCm} cm</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Objetivo</p>
              <p className="font-medium capitalize">{user.goal}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Atividade</p>
              <p className="font-medium text-xs">{user.activityLevel.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Estratégia</p>
              <p className="font-medium text-xs">{user.dietPreset.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Hormônios</p>
              <p className="font-medium text-xs">{user.usingHormones ? 'Sim' : 'Não'}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Sens. Insulina</p>
              <p className="font-medium text-xs capitalize">{user.insulinSens}</p>
            </div>
          </div>
        </section>

        {/* Consultas */}
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Calendar size={15} /> Acompanhamento de consultas
            </h2>
            <button onClick={() => setShowSchedule(v => !v)} className="btn-primary text-xs flex items-center gap-1 py-1.5 px-2.5">
              <CalendarPlus size={13} /> {showSchedule ? 'Cancelar' : 'Agendar'}
            </button>
          </div>

          {/* Resumo: última e próxima */}
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className="rounded-xl bg-ink-50 p-3">
              <p className="text-xs text-ink-400">Última consulta</p>
              {lastConsult ? (
                <>
                  <p className="font-bold">{format(new Date(lastConsult.completedAt!), 'dd/MM/yyyy', { locale: ptBR })}</p>
                  <p className="text-xs text-ink-500">há {differenceInDays(now, new Date(lastConsult.completedAt!))} dias · {lastConsult.type}</p>
                </>
              ) : <p className="text-ink-300 text-sm">Nenhuma realizada</p>}
            </div>
            <div className={`rounded-xl p-3 ${nextConsult ? 'bg-brand-50' : 'bg-yellow-50'}`}>
              <p className="text-xs text-ink-400">Próxima consulta</p>
              {nextConsult ? (
                <>
                  <p className="font-bold text-brand-700">{format(new Date(nextConsult.scheduledAt), "dd/MM 'às' HH:mm", { locale: ptBR })}</p>
                  <p className="text-xs text-brand-700/70">em {differenceInDays(new Date(nextConsult.scheduledAt), now)} dias · {nextConsult.type}</p>
                </>
              ) : <p className="text-yellow-700 text-sm">⚠️ Não agendada</p>}
            </div>
          </div>

          {/* Formulário de agendamento */}
          {showSchedule && (
            <div className="border-t pt-3 space-y-2 mb-3">
              <p className="text-xs font-semibold text-ink-600">Agendar nova consulta</p>
              <div className="grid grid-cols-2 gap-2">
                <input type="datetime-local" className="input text-sm" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} min={format(now, "yyyy-MM-dd'T'HH:mm")} />
                <select className="input text-sm" value={scheduleType} onChange={e => setScheduleType(e.target.value as typeof scheduleType)}>
                  <option value="retorno">Retorno</option>
                  <option value="inicial">Consulta inicial</option>
                  <option value="ajuste">Ajuste de plano</option>
                  <option value="avaliacao">Avaliação física</option>
                </select>
              </div>
              <textarea
                className="input text-sm" rows={2}
                value={scheduleNotes} onChange={e => setScheduleNotes(e.target.value)}
                placeholder="Observações (opcional): pauta da consulta, lembrete de exames..."
              />
              <button onClick={handleSchedule} disabled={pending || !scheduleDate} className="btn-primary text-sm w-full py-1.5">
                {pending ? 'Agendando...' : 'Confirmar agendamento'}
              </button>
            </div>
          )}

          {/* Lista de consultas futuras */}
          {upcomingConsults.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-ink-500 mb-2">Agendadas</p>
              <div className="space-y-1.5">
                {upcomingConsults.map(co => (
                  <div key={co.id} className="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50/40 p-2.5 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{format(new Date(co.scheduledAt), "EEE, dd 'de' MMM 'às' HH:mm", { locale: ptBR })}</p>
                      <p className="text-xs text-ink-500 capitalize">{co.type}{co.notes && ` · ${co.notes}`}</p>
                    </div>
                    <div className="flex gap-1">
                      {editNotesId === co.id ? (
                        <div className="flex flex-col gap-1">
                          <textarea
                            value={completeNotes} onChange={e => setCompleteNotes(e.target.value)}
                            className="input text-xs" rows={2}
                            placeholder="Notas da consulta..."
                          />
                          <div className="flex gap-1">
                            <button onClick={() => handleComplete(co.id)} disabled={pending} className="btn-primary text-xs py-1 px-2 flex-1">Salvar</button>
                            <button onClick={() => setEditNotesId(null)} className="btn-ghost text-xs py-1 px-2">×</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => { setEditNotesId(co.id); setCompleteNotes(co.notes ?? ''); }} title="Marcar realizada" className="p-1.5 rounded hover:bg-brand-100 text-brand-700">
                            <Check size={14} />
                          </button>
                          <button onClick={() => handleDelete(co.id)} title="Excluir" className="p-1.5 rounded hover:bg-red-50 text-red-500">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Histórico de consultas realizadas */}
          {pastConsults.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-ink-500 mb-2">Histórico ({pastConsults.length})</p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {pastConsults.map(co => (
                  <div key={co.id} className="rounded-lg border border-ink-200 p-2.5 text-sm">
                    <p className="font-medium">{format(new Date(co.completedAt!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                    <p className="text-xs text-ink-500 capitalize">{co.type}</p>
                    {co.notes && <p className="text-xs text-ink-600 mt-1 italic">{co.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {user.consultations.length === 0 && !showSchedule && (
            <p className="text-sm text-ink-400 text-center py-3">Nenhuma consulta registrada. Clique em <strong>Agendar</strong> para começar.</p>
          )}
        </section>

        {/* Metas */}
        <section className="card">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"><Target size={15} /> Metas diárias</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
            <div className="text-center bg-brand-50 rounded-lg p-2">
              <p className="text-xs text-ink-500">Calorias</p>
              <p className="font-bold text-brand-700">{user.baseKcal}</p>
            </div>
            <div className="text-center bg-red-50 rounded-lg p-2">
              <p className="text-xs text-ink-500">Dia lixo</p>
              <p className="font-bold text-red-600">{user.cheatKcal}</p>
            </div>
            <div className="text-center bg-blue-50 rounded-lg p-2">
              <p className="text-xs text-ink-500">Proteína</p>
              <p className="font-bold text-blue-600">{user.proteinGoalG}g</p>
            </div>
            <div className="text-center bg-yellow-50 rounded-lg p-2">
              <p className="text-xs text-ink-500">Carbo</p>
              <p className="font-bold text-yellow-600">{user.carbGoalG}g</p>
            </div>
            <div className="text-center bg-orange-50 rounded-lg p-2">
              <p className="text-xs text-ink-500">Gordura</p>
              <p className="font-bold text-orange-600">{user.fatGoalG}g</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-ink-500 space-y-0.5">
            <p><strong>TMB:</strong> {bmrText} · <strong>TDEE:</strong> {tdeeText}</p>
            {hormonalNote && <p className="text-yellow-700">⚠️ {hormonalNote}</p>}
          </div>
        </section>

        {/* Medidas */}
        <section className="card">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"><Scale size={15} /> Composição corporal</h2>
          {latest ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                <div>
                  <p className="text-xs text-ink-400">Peso</p>
                  <p className="font-bold text-lg">{latest.weightKg} kg</p>
                  {previous && (
                    <p className={`text-xs ${latest.weightKg - previous.weightKg < 0 ? 'text-brand-600' : 'text-red-500'}`}>
                      {latest.weightKg - previous.weightKg > 0 ? '+' : ''}{(latest.weightKg - previous.weightKg).toFixed(1)} kg
                    </p>
                  )}
                </div>
                {latest.bodyFatPct && (
                  <div>
                    <p className="text-xs text-ink-400">% Gordura</p>
                    <p className="font-bold text-lg">{latest.bodyFatPct}%</p>
                  </div>
                )}
                {latest.waistCm && <div><p className="text-xs text-ink-400">Cintura</p><p className="font-bold">{latest.waistCm} cm</p></div>}
                {latest.abdomenCm && <div><p className="text-xs text-ink-400">Abdômen</p><p className="font-bold">{latest.abdomenCm} cm</p></div>}
                {latest.hipCm && <div><p className="text-xs text-ink-400">Quadril</p><p className="font-bold">{latest.hipCm} cm</p></div>}
                {latest.armCm && <div><p className="text-xs text-ink-400">Braço</p><p className="font-bold">{latest.armCm} cm</p></div>}
                {latest.thighCm && <div><p className="text-xs text-ink-400">Coxa</p><p className="font-bold">{latest.thighCm} cm</p></div>}
              </div>

              {weightChart.length > 1 && (
                <div className="border-t pt-3">
                  <p className="text-xs text-ink-500 mb-2">Histórico de peso (kg)</p>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={weightChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="peso" stroke="#16a34a" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <p className="text-xs text-ink-400 mt-2">Última medição: {format(new Date(latest.date), "dd/MM/yyyy", { locale: ptBR })}</p>
            </>
          ) : (
            <p className="text-sm text-ink-400 text-center py-4">Sem medidas registradas ainda.</p>
          )}
        </section>

        {/* Medicamentos */}
        <section className="card">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"><Pill size={15} /> Medicamentos ativos ({user.medications.length})</h2>
          {user.medications.length === 0 ? (
            <p className="text-sm text-ink-400 text-center py-4">Nenhum medicamento ativo.</p>
          ) : (
            <div className="space-y-3">
              {user.medications.map(med => (
                <div key={med.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{med.name}</p>
                      <p className="text-xs text-ink-400">
                        {med.doseAmount} {med.doseUnit} · {med.frequency === 'weekly' ? 'semanal' : med.frequency === 'daily' ? 'diário' : med.frequency} · {med.category}
                      </p>
                    </div>
                    <span className={`badge ${
                      med.category === 'glp1' ? 'badge-green' :
                      med.category === 'trt' ? 'bg-purple-100 text-purple-700' :
                      'badge-blue'
                    }`}>{med.category}</span>
                  </div>
                  {med.logs.length > 0 && (
                    <div className="mt-2 text-xs text-ink-500 space-y-0.5">
                      <p className="font-semibold">Últimos registros:</p>
                      {med.logs.slice(0, 3).map(log => (
                        <p key={log.id}>
                          {format(new Date(log.takenAt), "dd/MM HH:mm", { locale: ptBR })}
                          {' · '}{log.doseAmount} {log.doseUnit}
                          {log.sideEffects && <span className="text-red-500"> · {log.sideEffects.split(',').map(s => SIDE_EFFECT_LABELS[s] ?? s).join(', ')}</span>}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Exames */}
        <section className="card">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"><FlaskConical size={15} /> Últimos exames</h2>
          {user.labResults.length === 0 ? (
            <p className="text-sm text-ink-400 text-center py-4">Nenhum exame registrado.</p>
          ) : (
            <div className="space-y-3">
              {user.labResults.map(lab => (
                <div key={lab.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <p className="font-medium text-xs text-ink-500 mb-1">
                    {format(new Date(lab.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {lab.testTotal && <p><span className="text-ink-400">T total:</span> <strong>{lab.testTotal}</strong> ng/dL</p>}
                    {lab.estradiol && <p><span className="text-ink-400">E2:</span> <strong>{lab.estradiol}</strong> pg/mL</p>}
                    {lab.hematocrit && <p><span className="text-ink-400">Ht:</span> <strong>{lab.hematocrit}</strong>%</p>}
                    {lab.psa && <p><span className="text-ink-400">PSA:</span> <strong>{lab.psa}</strong> ng/mL</p>}
                    {lab.glucoseFasting && <p><span className="text-ink-400">Glic:</span> <strong>{lab.glucoseFasting}</strong> mg/dL</p>}
                    {lab.hba1c && <p><span className="text-ink-400">HbA1c:</span> <strong>{lab.hba1c}</strong>%</p>}
                    {lab.ldl && <p><span className="text-ink-400">LDL:</span> <strong>{lab.ldl}</strong> mg/dL</p>}
                    {lab.hdl && <p><span className="text-ink-400">HDL:</span> <strong>{lab.hdl}</strong> mg/dL</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Refeições recentes */}
        <section className="card">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"><UtensilsCrossed size={15} /> Diário alimentar (30 dias)</h2>
          {Object.keys(mealsByDay).length === 0 ? (
            <p className="text-sm text-ink-400 text-center py-4">Sem refeições registradas.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(mealsByDay).slice(0, 7).map(([day, meals]) => {
                let dayKcal = 0, dayProt = 0;
                for (const m of meals) {
                  for (const item of m.items) {
                    const f = item.grams / 100;
                    dayKcal += item.food.kcal * f;
                    dayProt += item.food.protein * f;
                  }
                }
                return (
                  <div key={day} className="border-b pb-2 last:border-0 last:pb-0 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {format(new Date(day + 'T12:00:00'), "EEE, dd 'de' MMM", { locale: ptBR })}
                      </p>
                      <p className="text-xs text-ink-500">
                        <strong>{Math.round(dayKcal)}</strong> kcal · <strong>{Math.round(dayProt)}</strong>g prot · {meals.length} refeição{meals.length > 1 ? 'ões' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
