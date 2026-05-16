import { prisma } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTipOfDay } from '@/lib/presets/tips';
import { dietAlerts, labAlerts } from '@/lib/nutrition';
import { MacroRing } from '@/components/MacroRing';
import { AlertBanner } from '@/components/AlertBanner';
import { CheatDayToggle } from '@/components/CheatDayToggle';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MealSlotSummary } from '@/components/MealSlotSummary';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const user = await prisma.user.findFirst();
  if (!user) redirect('/perfil');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today); todayEnd.setDate(todayEnd.getDate() + 1);

  // Plano do dia
  const plan = await prisma.dailyPlan.findFirst({
    where: { userId: user.id, date: { gte: today, lt: todayEnd } },
  });

  const targetKcal = plan ? plan.kcalTarget : user.baseKcal;
  const isCheat = plan?.isCheatDay ?? false;
  const kcalTarget = isCheat ? user.cheatKcal : user.baseKcal;

  // Refeições de hoje
  const meals = await prisma.meal.findMany({
    where: { userId: user.id, date: { gte: today, lt: todayEnd } },
    include: { items: { include: { food: true } } },
  });

  // Calcular macros consumidos
  let consumed = { kcal: 0, protein: 0, carb: 0, fat: 0 };
  for (const meal of meals) {
    for (const item of meal.items) {
      const f = item.grams / 100;
      consumed.kcal    += item.food.kcal * f;
      consumed.protein += item.food.protein * f;
      consumed.carb    += item.food.carb * f;
      consumed.fat     += item.food.fat * f;
    }
  }

  // Última medida para alertas
  const lastMeasure = await prisma.measurement.findFirst({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  });

  // Último exame para alertas labs
  const lastLab = await prisma.labResult.findFirst({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  });

  // Alertas
  const daysOnDeficit = lastMeasure
    ? Math.floor((Date.now() - new Date(lastMeasure.date).getTime()) / 86400000)
    : 0;

  const nutritionAlerts = dietAlerts({
    kcal: kcalTarget,
    weightKg: lastMeasure?.weightKg ?? 70,
    daysOnDeficit,
    bodyFatPct: lastMeasure?.bodyFatPct,
    sex: user.sex as 'M' | 'F',
    usingHormones: user.usingHormones,
  });

  const labWarnings = lastLab ? labAlerts({
    hematocrit: lastLab.hematocrit,
    psa: lastLab.psa,
    testTotal: lastLab.testTotal,
    estradiol: lastLab.estradiol,
    ldl: lastLab.ldl,
    hdl: lastLab.hdl,
    alt: lastLab.alt,
    ast: lastLab.ast,
  }) : [];

  const allAlerts = [...nutritionAlerts, ...labWarnings];

  // Medicamentos para hoje
  const meds = await prisma.medication.findMany({
    where: { userId: user.id, active: true },
    include: { logs: { where: { takenAt: { gte: today, lt: todayEnd } } } },
  });
  const medsToday = meds.filter(m => {
    if (m.frequency === 'daily') return true;
    if (m.frequency === 'weekly') return m.weekday === today.getDay();
    return false;
  });

  const tip = getTipOfDay();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-ink-400 text-sm capitalize">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
          <h1 className="text-2xl font-bold">Olá, {user.name.split(' ')[0]}! 👋</h1>
        </div>
        <CheatDayToggle userId={user.id} date={today.toISOString()} isCheat={isCheat} planId={plan?.id} cheatKcal={user.cheatKcal} baseKcal={user.baseKcal} proteinG={user.proteinGoalG} carbG={user.carbGoalG} fatG={user.fatGoalG} />
      </div>

      {/* Alertas */}
      {allAlerts.length > 0 && (
        <div className="space-y-2">
          {allAlerts.map((a, i) => <AlertBanner key={i} alert={a} />)}
        </div>
      )}

      {/* Macro anel central */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-ink-400">Meta do dia</p>
            <p className="text-3xl font-bold">{Math.round(consumed.kcal)} <span className="text-base font-normal text-ink-400">/ {kcalTarget} kcal</span></p>
            {isCheat && <span className="badge-red text-xs mt-1">Dia Lixo 🍕</span>}
          </div>
          <MacroRing consumed={Math.round(consumed.kcal)} target={kcalTarget} size={80} />
        </div>

        {/* Barras macro */}
        <div className="space-y-2.5">
          <MacroBar label="Proteína" consumed={consumed.protein} target={user.proteinGoalG} color="bg-blue-500" unit="g" />
          <MacroBar label="Carboidrato" consumed={consumed.carb} target={user.carbGoalG} color="bg-yellow-400" unit="g" />
          <MacroBar label="Gordura" consumed={consumed.fat} target={user.fatGoalG} color="bg-red-400" unit="g" />
        </div>

        <Link href="/diario" className="mt-4 btn-primary w-full py-2 text-sm block text-center">
          + Registrar refeição
        </Link>
      </div>

      {/* Resumo de refeições de hoje */}
      {meals.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-3">Refeições de hoje</h2>
          <div className="space-y-2">
            {meals.map(meal => (
              <MealSlotSummary key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      )}

      {/* Medicamentos do dia */}
      {medsToday.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-3">Medicamentos de hoje</h2>
          <div className="space-y-2">
            {medsToday.map(med => {
              const taken = med.logs.length > 0;
              return (
                <div key={med.id} className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${taken ? 'bg-brand-50' : 'bg-ink-50'}`}>
                  <div>
                    <p className="text-sm font-medium">{med.name}</p>
                    <p className="text-xs text-ink-400">{med.doseAmount} {med.doseUnit} · {med.timeOfDay ?? 'qualquer hora'}</p>
                  </div>
                  {taken
                    ? <span className="badge-green text-xs">✓ Tomado</span>
                    : <Link href={`/medicamentos/${med.id}/log`} className="btn-primary text-xs py-1 px-3">Registrar</Link>
                  }
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dica do dia */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-xs font-semibold text-brand-600 mb-1">💡 DICA DO DIA</p>
        <p className="text-sm text-ink-800">{tip.text}</p>
        <p className="text-xs text-ink-400 mt-2">{tip.source}</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/coach" className="card flex flex-col gap-1 hover:border-brand-400 transition-colors border-brand-200 bg-brand-50">
          <span className="text-2xl">🤖</span>
          <span className="font-medium text-sm text-brand-700">Coach IA</span>
          <span className="text-xs text-ink-400">Cardápios e treino</span>
        </Link>
        <Link href="/evolucao" className="card flex flex-col gap-1 hover:border-brand-400 transition-colors">
          <span className="text-2xl">📊</span>
          <span className="font-medium text-sm">Evolução</span>
          <span className="text-xs text-ink-400">Peso e medidas</span>
        </Link>
        <Link href="/exames" className="card flex flex-col gap-1 hover:border-brand-400 transition-colors">
          <span className="text-2xl">🔬</span>
          <span className="font-medium text-sm">Exames</span>
          <span className="text-xs text-ink-400">Hormônios e labs</span>
        </Link>
      </div>
    </div>
  );
}

function MacroBar({ label, consumed, target, color, unit }: {
  label: string; consumed: number; target: number; color: string; unit: string;
}) {
  const pct = Math.min(100, (consumed / target) * 100);
  const over = consumed > target;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-ink-500">{label}</span>
        <span className={over ? 'text-red-500 font-medium' : 'text-ink-600'}>
          {Math.round(consumed)}{unit} / {target}{unit}
        </span>
      </div>
      <div className="macro-bar">
        <div className={`macro-bar-fill ${over ? 'bg-red-400' : color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
