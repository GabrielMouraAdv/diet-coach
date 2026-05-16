'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  calcBMR,
  calcTDEE,
  calcMacros,
  suggestKcalTarget,
  fiberTarget,
  yearsBetween,
  estimateBodyFat,
  BF_CATEGORY_LABEL,
  ACTIVITY_LABEL,
  DIET_PRESETS,
  type ActivityLevel,
  type Goal,
  type DietPreset,
  type InsulinSensitivity,
} from '@/lib/nutrition';
import { saveProfile } from './actions';
import type { User } from '@prisma/client';
import { Calculator } from 'lucide-react';

interface Props {
  user: User | null;
}

export function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name:         user?.name ?? '',
    birthDate:    user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
    sex:          user?.sex ?? 'M',
    heightCm:     user?.heightCm?.toString() ?? '',
    goal:         (user?.goal ?? 'cut') as Goal,
    activityLevel:(user?.activityLevel ?? 'moderate') as ActivityLevel,
    insulinSens:  (user?.insulinSens ?? 'normal') as InsulinSensitivity,
    dietPreset:   (user?.dietPreset ?? 'flexible') as DietPreset,
    usingHormones:user?.usingHormones ?? false,
    baseKcal:     user?.baseKcal?.toString() ?? '',
    cheatKcal:    user?.cheatKcal?.toString() ?? '',
  });

  // última medida para os cálculos
  const [latestWeight, setLatestWeight] = useState('');
  const [latestBF, setLatestBF] = useState('');

  // circunferências para estimativa de %BF
  const [abdomen, setAbdomen] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [showBFCalc, setShowBFCalc] = useState(false);

  // estimativa de %BF (Taylor et al. 2024)
  const bfEstimate = useMemo(() => {
    const w = parseFloat(latestWeight);
    const abd = parseFloat(abdomen);
    if (!w || !abd || w < 30 || abd < 40) return null;
    return estimateBodyFat({
      sex: form.sex as 'M' | 'F',
      weightKg: w,
      abdomenCm: abd,
      hipCm: parseFloat(hip) || undefined,
      waistCm: parseFloat(waist) || undefined,
    });
  }, [form.sex, latestWeight, abdomen, hip, waist]);

  // cálculos ao vivo
  const [calc, setCalc] = useState<{
    bmr: number; tdee: number; suggested: number; macros: ReturnType<typeof calcMacros> | null; fiber: { min: number; max: number } | null; method: string;
  } | null>(null);

  useEffect(() => {
    const wkg = parseFloat(latestWeight);
    const hcm = parseFloat(form.heightCm);
    const bf  = parseFloat(latestBF) || null;
    if (!wkg || !hcm || !form.birthDate) { setCalc(null); return; }
    const age = yearsBetween(new Date(form.birthDate));
    const { value: bmr, method } = calcBMR({ weightKg: wkg, heightCm: hcm, ageYears: age, sex: form.sex as 'M'|'F', bodyFatPct: bf });
    const tdee = calcTDEE(bmr, form.activityLevel);
    const suggested = suggestKcalTarget(tdee, form.goal);
    const kcal = parseInt(form.baseKcal) || suggested;
    const macros = calcMacros({ kcal, weightKg: wkg, preset: form.dietPreset });
    const fiber = fiberTarget(kcal);
    setCalc({ bmr: Math.round(bmr), tdee: Math.round(tdee), suggested, macros, fiber, method });
  }, [form.birthDate, form.sex, form.heightCm, form.activityLevel, form.goal, form.dietPreset, form.baseKcal, latestWeight, latestBF]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const wkg = parseFloat(latestWeight) || 0;
      const macros = calc?.macros;
      await saveProfile({
        ...form,
        heightCm: parseFloat(form.heightCm),
        baseKcal: parseInt(form.baseKcal) || (calc?.suggested ?? 1200),
        cheatKcal: parseInt(form.cheatKcal) || 1800,
        proteinGoalG: macros?.proteinG ?? 120,
        carbGoalG: macros?.carbG ?? 100,
        fatGoalG: macros?.fatG ?? 50,
        weightKg: wkg,
        bodyFatPct: parseFloat(latestBF) || null,
      });
      router.refresh();
      router.push('/');
    } catch {
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados pessoais */}
      <section className="card space-y-4">
        <h2 className="font-semibold text-ink-800">Dados pessoais</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Nome</label>
            <input className="input" value={form.name} onChange={set('name')} required placeholder="Seu nome" />
          </div>
          <div>
            <label className="label">Data de nascimento</label>
            <input className="input" type="date" value={form.birthDate} onChange={set('birthDate')} required />
          </div>
          <div>
            <label className="label">Sexo biológico</label>
            <select className="input" value={form.sex} onChange={set('sex')}>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
          <div>
            <label className="label">Altura (cm)</label>
            <input className="input" type="number" value={form.heightCm} onChange={set('heightCm')} min={100} max={250} step={0.1} placeholder="175" required />
          </div>
        </div>
      </section>

      {/* Medidas atuais (p/ cálculo) */}
      <section className="card space-y-4">
        <h2 className="font-semibold text-ink-800">Medidas atuais <span className="text-xs font-normal text-ink-400">(p/ calcular BMR)</span></h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Peso atual (kg)</label>
            <input className="input" type="number" value={latestWeight} onChange={e => setLatestWeight(e.target.value)} step={0.1} placeholder="80" />
          </div>
          <div>
            <label className="label">% de gordura corporal <span className="text-ink-400">(opcional)</span></label>
            <input className="input" type="number" value={latestBF} onChange={e => setLatestBF(e.target.value)} step={0.1} min={3} max={60} placeholder="ex: 22" />
            <p className="text-xs text-ink-400 mt-1">Com %BF usa Katch-McArdle (mais preciso)</p>
          </div>
        </div>

        {/* Calculadora de %BF a partir de circunferências */}
        <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-3">
          <button
            type="button"
            onClick={() => setShowBFCalc(v => !v)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-brand-800">
              <Calculator size={16} /> Não sabe seu % de gordura? Calcule aqui
            </span>
            <span className="text-ink-400 text-xs">{showBFCalc ? '−' : '+'}</span>
          </button>

          {showBFCalc && (
            <div className="mt-3 space-y-3 border-t border-brand-200 pt-3">
              <p className="text-xs text-ink-500">
                Equação de <strong>Taylor et al. 2024</strong> (US Army, validada com DXA em 1.904 pessoas). Quanto mais medidas, mais precisa.
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="label text-xs">Abdômen (cm) *</label>
                  <input className="input text-sm" type="number" value={abdomen} onChange={e => setAbdomen(e.target.value)} step={0.5} placeholder="no umbigo" />
                </div>
                <div>
                  <label className="label text-xs">Cintura (cm)</label>
                  <input className="input text-sm" type="number" value={waist} onChange={e => setWaist(e.target.value)} step={0.5} placeholder="mais estreita" />
                </div>
                <div>
                  <label className="label text-xs">Quadril (cm)</label>
                  <input className="input text-sm" type="number" value={hip} onChange={e => setHip(e.target.value)} step={0.5} placeholder="mais largo" />
                </div>
              </div>

              <div className="rounded-lg bg-white border border-ink-200 p-2.5 text-xs text-ink-600 space-y-1">
                <p><strong>Como medir (fita métrica flexível):</strong></p>
                <p>• <strong>Abdômen:</strong> ao nível do umbigo, em pé, relaxado, ao final de uma expiração normal.</p>
                <p>• <strong>Cintura:</strong> parte mais estreita do tronco (acima do umbigo, abaixo das costelas).</p>
                <p>• <strong>Quadril:</strong> ponto mais largo do quadril.</p>
              </div>

              {!bfEstimate && (
                <p className="text-xs text-ink-400">💡 Preencha peso (acima) + abdômen para estimar.</p>
              )}

              {bfEstimate && (
                <div className={`rounded-lg border p-3 ${
                  bfEstimate.category === 'essencial' ? 'border-blue-200 bg-blue-50' :
                  bfEstimate.category === 'atletico'  ? 'border-brand-300 bg-brand-100' :
                  bfEstimate.category === 'fitness'   ? 'border-green-200 bg-green-50' :
                  bfEstimate.category === 'aceitavel' ? 'border-yellow-200 bg-yellow-50' :
                  'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-2xl font-bold leading-tight">{bfEstimate.bodyFatPct}%</p>
                      <p className="text-xs text-ink-500">{BF_CATEGORY_LABEL[bfEstimate.category]} · equação de {bfEstimate.sites}-sítio{bfEstimate.sites > 1 ? 's' : ''}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLatestBF(bfEstimate.bodyFatPct.toString())}
                      className="btn-primary text-xs py-2 px-3"
                    >
                      Usar {bfEstimate.bodyFatPct}% ↑
                    </button>
                  </div>
                  <p className="text-[10px] text-ink-500 mt-2">Margem de erro ≈ ±3-4 %BF.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resultado ao vivo */}
        {calc && (
          <div className="rounded-xl bg-brand-50 border border-brand-200 p-4 space-y-2">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-ink-500">TMB ({calc.method === 'katch' ? 'Katch-McArdle' : 'Mifflin-St Jeor'})</span>
                <p className="font-bold text-xl text-brand-700">{calc.bmr} kcal</p>
              </div>
              <div>
                <span className="text-ink-500">TDEE ({form.activityLevel})</span>
                <p className="font-bold text-xl text-ink-800">{calc.tdee} kcal</p>
              </div>
              <div>
                <span className="text-ink-500">Meta sugerida ({form.goal})</span>
                <p className="font-bold text-xl text-ink-800">{calc.suggested} kcal</p>
              </div>
            </div>
            {calc.macros && (
              <div className="flex flex-wrap gap-3 text-sm pt-2 border-t border-brand-200">
                <span className="badge-blue">P {calc.macros.proteinG}g</span>
                <span className="badge-yellow">C {calc.macros.carbG}g</span>
                <span className="badge bg-red-100 text-red-700">G {calc.macros.fatG}g</span>
                {calc.fiber && <span className="badge bg-green-100 text-green-700">Fibra {calc.fiber.min}–{calc.fiber.max}g</span>}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Objetivo e atividade */}
      <section className="card space-y-4">
        <h2 className="font-semibold text-ink-800">Objetivo e atividade</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Objetivo</label>
            <select className="input" value={form.goal} onChange={set('goal')}>
              <option value="cut">Cutting (perder gordura)</option>
              <option value="recomp">Recomp (manter peso, perder gordura)</option>
              <option value="maintain">Manutenção</option>
              <option value="bulk">Bulk (ganhar massa)</option>
            </select>
          </div>
          <div>
            <label className="label">Nível de atividade</label>
            <select className="input" value={form.activityLevel} onChange={set('activityLevel')}>
              {Object.entries(ACTIVITY_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sensibilidade à insulina */}
        <div>
          <label className="label">Sensibilidade à insulina</label>
          <div className="grid grid-cols-3 gap-2">
            {(['high', 'normal', 'low'] as const).map(v => (
              <label key={v} className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 cursor-pointer transition-colors
                ${form.insulinSens === v ? 'border-brand-500 bg-brand-50' : 'border-ink-200 hover:border-ink-300'}`}>
                <input type="radio" name="insulinSens" value={v} checked={form.insulinSens === v}
                  onChange={() => setForm(f => ({ ...f, insulinSens: v }))} className="sr-only" />
                <span className="text-lg">{v === 'high' ? '⚡' : v === 'normal' ? '🟡' : '🐌'}</span>
                <span className="text-xs font-medium text-center">
                  {v === 'high' ? 'Alta (resp. bem ao carbo)' : v === 'normal' ? 'Normal' : 'Baixa (inchaço/sono com carbo)'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Preset de dieta */}
        <div>
          <label className="label">Estratégia alimentar</label>
          <select className="input" value={form.dietPreset} onChange={set('dietPreset')}>
            {Object.entries(DIET_PRESETS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <p className="text-xs text-ink-400 mt-1">
            {DIET_PRESETS[form.dietPreset]?.bestFor}
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.usingHormones}
            onChange={e => setForm(f => ({ ...f, usingHormones: e.target.checked }))}
            className="rounded" />
          <span className="text-sm">Uso protocolo hormonal (TRT/GLP-1/outros)</span>
        </label>
      </section>

      {/* Metas calóricas */}
      <section className="card space-y-4">
        <h2 className="font-semibold text-ink-800">Metas calóricas</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Calorias base/dia (kcal)</label>
            <input className="input" type="number" value={form.baseKcal} onChange={set('baseKcal')}
              placeholder={calc?.suggested?.toString() ?? '1200'} min={800} max={5000} />
            {calc && !form.baseKcal && (
              <p className="text-xs text-brand-600 mt-1">Sugerido: {calc.suggested} kcal</p>
            )}
          </div>
          <div>
            <label className="label">Calorias no dia lixo (kcal)</label>
            <input className="input" type="number" value={form.cheatKcal} onChange={set('cheatKcal')}
              placeholder="1800" min={800} max={8000} />
          </div>
        </div>
      </section>

      <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-base">
        {saving ? 'Salvando...' : user ? 'Salvar alterações' : 'Criar perfil e começar →'}
      </button>
    </form>
  );
}
