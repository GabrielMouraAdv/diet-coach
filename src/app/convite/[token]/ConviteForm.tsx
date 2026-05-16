'use client';

import { useState } from 'react';
import { registerFromInviteAction } from '@/app/actions/auth';
import { calcBMR, calcTDEE, calcMacros, suggestKcalTarget, yearsBetween, ACTIVITY_LABEL } from '@/lib/nutrition';
import { Loader2 } from 'lucide-react';
import type { ActivityLevel, Goal } from '@/lib/nutrition';

interface Props {
  token: string;
  defaultName: string;
  defaultEmail: string;
}

export function ConviteForm({ token, defaultName, defaultEmail }: Props) {
  const [step, setStep] = useState<'account' | 'profile'>('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [account, setAccount] = useState({ email: defaultEmail, password: '', confirm: '' });
  const [profile, setProfile] = useState({
    name: defaultName,
    birthDate: '',
    sex: 'M',
    heightCm: '',
    goal: 'cut' as Goal,
    activityLevel: 'moderate' as ActivityLevel,
    baseKcal: '',
    cheatKcal: '1800',
  });

  // Cálculo ao vivo
  const calcLive = () => {
    const wkg = 0; // não temos peso ainda no cadastro
    const hcm = parseFloat(profile.heightCm);
    const age = profile.birthDate ? yearsBetween(new Date(profile.birthDate)) : 0;
    if (!hcm || !age) return null;
    // estimativa com peso padrão 75kg (refinam depois no perfil)
    const { value: bmr } = calcBMR({ weightKg: 75, heightCm: hcm, ageYears: age, sex: profile.sex as 'M' | 'F' });
    const tdee = calcTDEE(bmr, profile.activityLevel);
    const suggested = suggestKcalTarget(tdee, profile.goal);
    const macros = calcMacros({ kcal: parseInt(profile.baseKcal) || suggested, weightKg: 75 });
    return { suggested, macros };
  };

  const live = calcLive();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'account') {
      if (account.password !== account.confirm) { setError('As senhas não coincidem.'); return; }
      if (account.password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres.'); return; }
      setError('');
      setStep('profile');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const kcal = parseInt(profile.baseKcal) || live?.suggested || 1200;
      const macros = calcMacros({ kcal, weightKg: 75 });
      const result = await registerFromInviteAction({
        token,
        email: account.email,
        password: account.password,
        name: profile.name,
        birthDate: profile.birthDate,
        sex: profile.sex,
        heightCm: parseFloat(profile.heightCm),
        goal: profile.goal,
        activityLevel: profile.activityLevel,
        baseKcal: kcal,
        cheatKcal: parseInt(profile.cheatKcal) || 1800,
        proteinGoalG: macros.proteinG,
        carbGoalG: macros.carbG,
        fatGoalG: macros.fatG,
      });
      if (result?.error) setError(result.error);
    } catch {
      // redirect = ok
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Indicador de passo */}
      <div className="flex gap-2 mb-2">
        {['account', 'profile'].map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${step === s || (i === 0 && step === 'profile') ? 'bg-brand-500' : 'bg-ink-200'}`} />
        ))}
      </div>

      {step === 'account' ? (
        <>
          <h2 className="font-semibold text-ink-800">1. Crie sua conta</h2>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={account.email} onChange={e => setAccount(a => ({ ...a, email: e.target.value }))} required placeholder="seu@email.com" />
          </div>
          <div>
            <label className="label">Senha</label>
            <input className="input" type="password" value={account.password} onChange={e => setAccount(a => ({ ...a, password: e.target.value }))} required minLength={6} placeholder="mínimo 6 caracteres" />
          </div>
          <div>
            <label className="label">Confirmar senha</label>
            <input className="input" type="password" value={account.confirm} onChange={e => setAccount(a => ({ ...a, confirm: e.target.value }))} required placeholder="repita a senha" />
          </div>
        </>
      ) : (
        <>
          <h2 className="font-semibold text-ink-800">2. Seu perfil</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Nome completo</label>
              <input className="input text-sm" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} required placeholder="Seu nome" />
            </div>
            <div>
              <label className="label">Nascimento</label>
              <input className="input text-sm" type="date" value={profile.birthDate} onChange={e => setProfile(p => ({ ...p, birthDate: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Sexo</label>
              <select className="input text-sm" value={profile.sex} onChange={e => setProfile(p => ({ ...p, sex: e.target.value }))}>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <label className="label">Altura (cm)</label>
              <input className="input text-sm" type="number" value={profile.heightCm} onChange={e => setProfile(p => ({ ...p, heightCm: e.target.value }))} placeholder="175" min={100} max={250} />
            </div>
            <div>
              <label className="label">Objetivo</label>
              <select className="input text-sm" value={profile.goal} onChange={e => setProfile(p => ({ ...p, goal: e.target.value as Goal }))}>
                <option value="cut">Emagrecer</option>
                <option value="recomp">Recomp</option>
                <option value="maintain">Manutenção</option>
                <option value="bulk">Ganhar massa</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Atividade física</label>
              <select className="input text-sm" value={profile.activityLevel} onChange={e => setProfile(p => ({ ...p, activityLevel: e.target.value as ActivityLevel }))}>
                {Object.entries(ACTIVITY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          {live && (
            <div className="rounded-xl bg-brand-50 border border-brand-200 p-3 text-xs text-brand-700">
              Meta sugerida: <strong>{live.suggested} kcal/dia</strong> · P {live.macros.proteinG}g · C {live.macros.carbG}g · G {live.macros.fatG}g
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Meta calórica/dia</label>
              <input className="input text-sm" type="number" value={profile.baseKcal} onChange={e => setProfile(p => ({ ...p, baseKcal: e.target.value }))} placeholder={live?.suggested?.toString() ?? '1200'} min={800} max={5000} />
            </div>
            <div>
              <label className="label">Meta dia lixo</label>
              <input className="input text-sm" type="number" value={profile.cheatKcal} onChange={e => setProfile(p => ({ ...p, cheatKcal: e.target.value }))} placeholder="1800" min={800} max={8000} />
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-2">
        {step === 'profile' && (
          <button type="button" onClick={() => setStep('account')} className="btn-ghost flex-1 text-sm">← Voltar</button>
        )}
        <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 text-sm">
          {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : step === 'account' ? 'Continuar →' : 'Criar conta e entrar →'}
        </button>
      </div>
    </form>
  );
}
