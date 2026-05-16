'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { LabResult } from '@prisma/client';
import { LAB_REFERENCES } from '@/lib/presets/medications';
import { labAlerts } from '@/lib/nutrition';
import { saveLabResult } from './actions';
import { AlertBanner } from '@/components/AlertBanner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, FlaskConical } from 'lucide-react';

interface Props { userId: string; labs: LabResult[]; }

const LAB_GROUPS = [
  {
    title: '🧬 Hormonal',
    fields: ['testTotal', 'testFree', 'estradiol', 'dht', 'lh', 'fsh', 'prolactin', 'shbg'] as const,
  },
  {
    title: '🩸 Hemograma / Glicose',
    fields: ['hematocrit', 'hemoglobin', 'glucoseFasting', 'insulinFasting', 'hba1c'] as const,
  },
  {
    title: '💛 Lipídeos',
    fields: ['totalChol', 'ldl', 'hdl', 'triglycerides'] as const,
  },
  {
    title: '🫁 Hepático / Renal',
    fields: ['ast', 'alt', 'ggt', 'urea', 'creatinine', 'psa'] as const,
  },
  {
    title: '🦋 Tireoide',
    fields: ['tsh', 't4Free', 't3Free'] as const,
  },
];

export function ExamesClient({ userId, labs }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ date: format(new Date(), 'yyyy-MM-dd'), notes: '' });

  const latest = labs[0];

  const alerts = latest ? labAlerts({
    hematocrit: latest.hematocrit,
    psa: latest.psa,
    testTotal: latest.testTotal,
    estradiol: latest.estradiol,
    ldl: latest.ldl,
    hdl: latest.hdl,
    alt: latest.alt,
    ast: latest.ast,
  }) : [];

  const getStatus = (key: string, value: number | null | undefined) => {
    if (!value) return 'normal';
    const ref = LAB_REFERENCES[key];
    if (!ref) return 'normal';
    if (ref.alertMax && value > ref.alertMax) return ref.alertLevel ?? 'warn';
    if (ref.alertMin && value < ref.alertMin) return ref.alertLevel ?? 'warn';
    if (ref.refMax && value > ref.refMax) return 'warn';
    if (ref.refMin && value < ref.refMin) return 'warn';
    return 'ok';
  };

  const handleSave = () => {
    start(async () => {
      const data: Record<string, number | null | string> = { date: form.date, notes: form.notes || null };
      for (const key of Object.keys(LAB_REFERENCES)) {
        data[key] = form[key] ? parseFloat(form[key]) : null;
      }
      await saveLabResult({ userId, ...data } as Parameters<typeof saveLabResult>[0]);
      setShowForm(false);
      setForm({ date: format(new Date(), 'yyyy-MM-dd'), notes: '' });
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => <AlertBanner key={i} alert={a} />)}
        </div>
      )}

      {/* Último resultado */}
      {latest && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Último exame</p>
            <span className="text-xs text-ink-400">{format(new Date(latest.date), "dd/MM/yyyy", { locale: ptBR })}</span>
          </div>

          {LAB_GROUPS.map(group => {
            const visibleFields = group.fields.filter(f => latest[f as keyof LabResult] != null);
            if (visibleFields.length === 0) return null;
            return (
              <div key={group.title} className="mb-4">
                <p className="text-xs font-semibold text-ink-500 mb-2">{group.title}</p>
                <div className="grid grid-cols-2 gap-2">
                  {visibleFields.map(key => {
                    const ref = LAB_REFERENCES[key];
                    const value = latest[key as keyof LabResult] as number;
                    const status = getStatus(key, value);
                    return (
                      <div key={key} className={`rounded-xl p-2.5 border ${
                        status === 'danger' ? 'bg-red-50 border-red-200' :
                        status === 'warn' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-ink-50 border-ink-100'
                      }`}>
                        <p className="text-xs text-ink-500">{ref?.label ?? key}</p>
                        <p className={`font-bold text-sm ${
                          status === 'danger' ? 'text-red-700' :
                          status === 'warn' ? 'text-yellow-700' : 'text-ink-800'
                        }`}>
                          {value} <span className="font-normal text-xs">{ref?.unit}</span>
                        </p>
                        {ref?.refMin != null || ref?.refMax != null ? (
                          <p className="text-[10px] text-ink-400">
                            ref: {ref.refMin ?? '–'} – {ref.refMax ?? '–'} {ref.unit}
                          </p>
                        ) : null}
                        {ref?.note && <p className="text-[10px] text-ink-400">{ref.note}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {latest.notes && (
            <p className="text-xs text-ink-400 italic mt-2">{latest.notes}</p>
          )}
        </div>
      )}

      {/* Formulário */}
      {showForm ? (
        <div className="card space-y-4">
          <p className="font-semibold">Inserir resultado de exame</p>
          <p className="text-xs text-ink-400">Preencha apenas os campos disponíveis no seu laudo. Deixe em branco os que não realizou.</p>

          <div>
            <label className="label">Data do exame</label>
            <input className="input text-sm" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>

          {LAB_GROUPS.map(group => (
            <div key={group.title}>
              <p className="text-xs font-semibold text-ink-500 mb-2">{group.title}</p>
              <div className="grid grid-cols-2 gap-3">
                {group.fields.map(key => {
                  const ref = LAB_REFERENCES[key];
                  return (
                    <div key={key}>
                      <label className="label text-xs">{ref?.label ?? key} <span className="text-ink-400">({ref?.unit})</span></label>
                      <input
                        className="input text-sm"
                        type="number"
                        step="0.01"
                        value={form[key] ?? ''}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={ref?.refMax ? `ref < ${ref.refMax}` : ''}
                      />
                      {ref?.note && <p className="text-[10px] text-ink-400 mt-0.5">{ref.note}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <textarea className="input text-sm" rows={2} value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observações..." />

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={pending} className="btn-primary flex-1 text-sm">Salvar</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          <Plus size={18} /> Inserir resultado de exame
        </button>
      )}

      {/* Histórico */}
      {labs.length > 1 && (
        <div className="card">
          <p className="text-sm font-semibold mb-2">Histórico de exames</p>
          <div className="space-y-1">
            {labs.map(lab => (
              <div key={lab.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <FlaskConical size={14} className="text-ink-400" />
                  <span>{format(new Date(lab.date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
                <div className="flex gap-3 text-xs text-ink-500">
                  {lab.testTotal && <span>T: {lab.testTotal} ng/dL</span>}
                  {lab.hematocrit && <span>Ht: {lab.hematocrit}%</span>}
                  {lab.hba1c && <span>HbA1c: {lab.hba1c}%</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl bg-ink-50 border border-ink-200 p-3">
        <p className="text-xs text-ink-500">
          <strong>⚕️ Aviso:</strong> Os valores de referência são baseados em Haluch (2020) e Endocrine Society (2018). Seu médico pode adotar faixas diferentes. Este app não substitui acompanhamento médico.
        </p>
      </div>
    </div>
  );
}
