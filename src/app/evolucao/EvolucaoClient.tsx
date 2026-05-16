'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Measurement } from '@prisma/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { saveMeasurement } from './actions';
import { Plus } from 'lucide-react';

interface Props { userId: string; measurements: Measurement[]; }

export function EvolucaoClient({ userId, measurements }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weightKg: '', bodyFatPct: '', waistCm: '', hipCm: '',
    chestCm: '', armCm: '', thighCm: '', notes: '',
  });

  const handleSave = () => {
    start(async () => {
      await saveMeasurement({ userId, ...form,
        weightKg: parseFloat(form.weightKg),
        bodyFatPct: parseFloat(form.bodyFatPct) || null,
        waistCm: parseFloat(form.waistCm) || null,
        hipCm: parseFloat(form.hipCm) || null,
        chestCm: parseFloat(form.chestCm) || null,
        armCm: parseFloat(form.armCm) || null,
        thighCm: parseFloat(form.thighCm) || null,
      });
      setShowForm(false);
      router.refresh();
    });
  };

  const chartData = [...measurements]
    .reverse()
    .map(m => ({
      date: format(new Date(m.date), 'dd/MM'),
      peso: m.weightKg,
      bf: m.bodyFatPct ?? null,
    }));

  const latest = measurements[0];

  const metrics = [
    { label: 'Peso', value: latest?.weightKg, unit: 'kg', prev: measurements[1]?.weightKg },
    { label: '% Gordura', value: latest?.bodyFatPct, unit: '%', prev: measurements[1]?.bodyFatPct },
    { label: 'Cintura', value: latest?.waistCm, unit: 'cm', prev: measurements[1]?.waistCm },
    { label: 'Quadril', value: latest?.hipCm, unit: 'cm', prev: measurements[1]?.hipCm },
    { label: 'Braço', value: latest?.armCm, unit: 'cm', prev: measurements[1]?.armCm },
    { label: 'Coxa', value: latest?.thighCm, unit: 'cm', prev: measurements[1]?.thighCm },
  ];

  return (
    <div className="space-y-5">
      {/* Métricas rápidas */}
      {latest && (
        <div className="grid grid-cols-3 gap-3">
          {metrics.filter(m => m.value != null).map(({ label, value, unit, prev }) => {
            const diff = value != null && prev != null ? value - prev : null;
            return (
              <div key={label} className="card text-center p-3">
                <p className="text-xs text-ink-400 mb-0.5">{label}</p>
                <p className="text-xl font-bold">{value}{unit}</p>
                {diff != null && (
                  <p className={`text-xs font-medium ${diff < 0 ? 'text-brand-600' : diff > 0 ? 'text-red-500' : 'text-ink-400'}`}>
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Gráfico de peso */}
      {chartData.length > 1 && (
        <div className="card">
          <p className="text-sm font-semibold mb-3">Peso (kg)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="peso" stroke="#16a34a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartData.length > 1 && chartData.some(d => d.bf != null) && (
        <div className="card">
          <p className="text-sm font-semibold mb-3">% Gordura</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="bf" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Formulário */}
      {showForm ? (
        <div className="card space-y-4">
          <p className="font-semibold">Nova medição</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Data</label>
              <input className="input text-sm" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="label">Peso (kg) *</label>
              <input className="input text-sm" type="number" value={form.weightKg} onChange={e => setForm(f => ({ ...f, weightKg: e.target.value }))} step={0.1} placeholder="80.0" required />
            </div>
            <div>
              <label className="label">% Gordura</label>
              <input className="input text-sm" type="number" value={form.bodyFatPct} onChange={e => setForm(f => ({ ...f, bodyFatPct: e.target.value }))} step={0.5} placeholder="22" />
            </div>
            <div>
              <label className="label">Cintura (cm)</label>
              <input className="input text-sm" type="number" value={form.waistCm} onChange={e => setForm(f => ({ ...f, waistCm: e.target.value }))} step={0.5} />
            </div>
            <div>
              <label className="label">Quadril (cm)</label>
              <input className="input text-sm" type="number" value={form.hipCm} onChange={e => setForm(f => ({ ...f, hipCm: e.target.value }))} step={0.5} />
            </div>
            <div>
              <label className="label">Braço (cm)</label>
              <input className="input text-sm" type="number" value={form.armCm} onChange={e => setForm(f => ({ ...f, armCm: e.target.value }))} step={0.5} />
            </div>
            <div>
              <label className="label">Coxa (cm)</label>
              <input className="input text-sm" type="number" value={form.thighCm} onChange={e => setForm(f => ({ ...f, thighCm: e.target.value }))} step={0.5} />
            </div>
          </div>
          <textarea className="input text-sm" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observações..." />
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={pending || !form.weightKg} className="btn-primary flex-1 text-sm">Salvar</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          <Plus size={18} /> Registrar medição
        </button>
      )}

      {/* Histórico */}
      {measurements.length > 0 && (
        <div className="card">
          <p className="text-sm font-semibold mb-3">Histórico</p>
          <div className="space-y-1 text-xs">
            {measurements.slice(0, 10).map(m => (
              <div key={m.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
                <span className="text-ink-400">{format(new Date(m.date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                <span className="font-medium">{m.weightKg} kg</span>
                {m.bodyFatPct && <span className="text-ink-400">{m.bodyFatPct}% BF</span>}
                {m.waistCm && <span className="text-ink-400">{m.waistCm}cm cin.</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
