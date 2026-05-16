'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Medication, MedicationLog } from '@prisma/client';
import { MED_PRESETS, SIDE_EFFECTS_CATALOG, SIDE_EFFECT_LABELS, MED_DISCLAIMERS, TIRZEPATIDA_SCHEDULE, TIRZEPATIDA_EFFICACY, TIRZEPATIDA_ALERTS } from '@/lib/presets/medications';
import { saveMedication, logMedication, toggleMedicationActive } from './actions';
import { Plus, Pill, Check, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type MedWithLogs = Medication & { logs: MedicationLog[] };

interface Props {
  userId: string;
  medications: MedWithLogs[];
  todayStr: string;
}

export function MedicamentosClient({ userId, medications, todayStr }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [logMedId, setLogMedId] = useState<string | null>(null);
  const [logDose, setLogDose] = useState('');
  const [logSideEffects, setLogSideEffects] = useState<string[]>([]);
  const [logNotes, setLogNotes] = useState('');

  const [form, setForm] = useState({
    name: '', category: 'other', doseAmount: '', doseUnit: 'mg',
    frequency: 'weekly', weekday: '5', timeOfDay: '08:00',
    startDate: format(new Date(), 'yyyy-MM-dd'), notes: '',
  });

  const loadPreset = (presetName: string) => {
    const p = MED_PRESETS.find(m => m.name === presetName);
    if (!p) return;
    setForm(f => ({
      ...f,
      name: p.name,
      category: p.category,
      doseAmount: p.doseAmount.toString(),
      doseUnit: p.doseUnit,
      frequency: p.frequency,
      notes: p.note ?? '',
    }));
  };

  const handleSave = () => {
    const disclaimer = MED_DISCLAIMERS[form.category as keyof typeof MED_DISCLAIMERS];
    if (disclaimer) alert(disclaimer);
    start(async () => {
      await saveMedication({
        userId,
        ...form,
        doseAmount: parseFloat(form.doseAmount),
        weekday: parseInt(form.weekday),
      });
      setShowAdd(false);
      router.refresh();
    });
  };

  const handleLog = (med: MedWithLogs) => {
    start(async () => {
      await logMedication({
        userId,
        medicationId: med.id,
        doseAmount: parseFloat(logDose) || med.doseAmount,
        doseUnit: med.doseUnit,
        sideEffects: logSideEffects.join(','),
        notes: logNotes,
      });
      setLogMedId(null);
      setLogDose(''); setLogSideEffects([]); setLogNotes('');
      router.refresh();
    });
  };

  // Detectar alertas de tirzepatida nos últimos logs
  const mounjaro = medications.find(m => m.name.toLowerCase().includes('tirzepatida') || m.name.toLowerCase().includes('mounjaro'));
  const mounjaroAlerts = mounjaro?.logs.slice(0, 3).flatMap(log => {
    const effects = (log.sideEffects ?? '').split(',');
    return TIRZEPATIDA_ALERTS.filter(a => effects.includes(a.trigger));
  }) ?? [];

  return (
    <div className="space-y-4">
      {/* Alertas Mounjaro */}
      {mounjaroAlerts.length > 0 && (
        <div className="card border-yellow-200 bg-yellow-50 space-y-2">
          <p className="text-sm font-semibold text-yellow-800 flex items-center gap-1"><AlertTriangle size={14} /> Alertas Mounjaro</p>
          {mounjaroAlerts.map((a, i) => (
            <p key={i} className="text-xs text-yellow-700">{a.message}</p>
          ))}
        </div>
      )}

      {/* Escalonamento Mounjaro (se cadastrado) */}
      {mounjaro && (
        <div className="card">
          <p className="text-sm font-semibold mb-2">📈 Escalonamento Mounjaro</p>
          <div className="overflow-x-auto">
            <table className="text-xs w-full">
              <thead>
                <tr className="text-ink-400 border-b">
                  <th className="text-left pb-1">Semana</th>
                  <th className="text-left pb-1">Dose</th>
                  <th className="text-left pb-1">Obs</th>
                </tr>
              </thead>
              <tbody>
                {TIRZEPATIDA_SCHEDULE.map((s, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-1.5">{s.weekStart}{s.weekEnd ? `–${s.weekEnd}` : '+'}</td>
                    <td className="py-1.5 font-medium">{s.dose} {s.unit}</td>
                    <td className="py-1.5 text-ink-400">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-400 mt-2">
            Dose atual: {mounjaro.doseAmount} {mounjaro.doseUnit} —{' '}
            {TIRZEPATIDA_EFFICACY[`${mounjaro.doseAmount}mg` as keyof typeof TIRZEPATIDA_EFFICACY]?.note ?? 'escale gradualmente conforme tolerância'}
          </p>
        </div>
      )}

      {/* Lista de medicamentos */}
      {medications.map(med => {
        const todayLog = med.logs.find(l => new Date(l.takenAt) >= parseISO(todayStr.split('T')[0]));
        const isExpanded = expandedId === med.id;

        return (
          <div key={med.id} className={`card p-0 overflow-hidden ${!med.active ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                med.category === 'glp1' ? 'bg-brand-100 text-brand-700' :
                med.category === 'trt' ? 'bg-purple-100 text-purple-700' :
                med.category === 'hormone' ? 'bg-blue-100 text-blue-700' :
                'bg-ink-100 text-ink-600'
              }`}>
                <Pill size={16} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{med.name}</p>
                <p className="text-xs text-ink-400">{med.doseAmount} {med.doseUnit} · {med.frequency === 'weekly' ? 'semanal' : med.frequency === 'daily' ? 'diário' : med.frequency}</p>
              </div>
              {todayLog
                ? <span className="badge-green text-xs flex items-center gap-1"><Check size={11} /> Tomado</span>
                : med.active && (
                  <button onClick={() => setLogMedId(med.id)} className="btn-primary text-xs py-1 px-3">
                    Registrar
                  </button>
                )
              }
              <button onClick={() => setExpandedId(isExpanded ? null : med.id)} className="p-1 rounded hover:bg-ink-100 text-ink-400">
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Log de hoje */}
            {logMedId === med.id && (
              <div className="border-t px-4 py-3 space-y-3 bg-ink-50">
                <p className="text-sm font-medium">Registrar dose de hoje</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Dose aplicada ({med.doseUnit})</label>
                    <input className="input text-sm" type="number" value={logDose} onChange={e => setLogDose(e.target.value)} placeholder={med.doseAmount.toString()} step={0.5} />
                  </div>
                  <div>
                    <label className="label">Hora</label>
                    <input className="input text-sm" type="time" defaultValue={med.timeOfDay ?? '08:00'} />
                  </div>
                </div>
                <div>
                  <label className="label">Efeitos colaterais (opcional)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[...SIDE_EFFECTS_CATALOG.gastrointestinal, ...SIDE_EFFECTS_CATALOG.hormonal.slice(0, 3), ...SIDE_EFFECTS_CATALOG.mental.slice(0, 2)].map(k => (
                      <label key={k} className={`flex items-center gap-1 text-xs rounded-full px-2.5 py-1 border cursor-pointer transition-colors
                        ${logSideEffects.includes(k) ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white border-ink-200 text-ink-600'}`}>
                        <input type="checkbox" className="sr-only" checked={logSideEffects.includes(k)}
                          onChange={e => setLogSideEffects(p => e.target.checked ? [...p, k] : p.filter(x => x !== k))} />
                        {SIDE_EFFECT_LABELS[k]}
                      </label>
                    ))}
                  </div>
                </div>
                <textarea className="input text-sm" rows={2} value={logNotes} onChange={e => setLogNotes(e.target.value)} placeholder="Observações..." />
                <div className="flex gap-2">
                  <button onClick={() => handleLog(med)} disabled={pending} className="btn-primary text-sm flex-1">Confirmar</button>
                  <button onClick={() => setLogMedId(null)} className="btn-ghost text-sm">Cancelar</button>
                </div>
              </div>
            )}

            {/* Histórico expandido */}
            {isExpanded && (
              <div className="border-t px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-ink-500">Histórico recente</p>
                  <button onClick={() => {
                    start(async () => {
                      await toggleMedicationActive(med.id, !med.active);
                      router.refresh();
                    });
                  }} className={`text-xs ${med.active ? 'text-red-500 hover:text-red-700' : 'text-brand-600 hover:text-brand-800'}`}>
                    {med.active ? 'Desativar' : 'Reativar'}
                  </button>
                </div>
                {med.logs.length === 0 && <p className="text-xs text-ink-400">Nenhum registro ainda.</p>}
                {med.logs.map(log => (
                  <div key={log.id} className="text-xs text-ink-600 flex items-start justify-between">
                    <div>
                      <span className="font-medium">{format(new Date(log.takenAt), "dd/MM HH:mm", { locale: ptBR })}</span>
                      {' · '}{log.doseAmount} {log.doseUnit}
                      {log.sideEffects && <span className="text-red-500"> · {log.sideEffects.split(',').map(s => SIDE_EFFECT_LABELS[s] ?? s).join(', ')}</span>}
                    </div>
                  </div>
                ))}
                {med.notes && <p className="text-xs text-ink-400 italic">{med.notes}</p>}
              </div>
            )}
          </div>
        );
      })}

      {/* Adicionar medicamento */}
      {showAdd ? (
        <div className="card space-y-4">
          <p className="font-semibold">Novo medicamento</p>

          <div>
            <label className="label">Selecionar preset</label>
            <select className="input text-sm" onChange={e => loadPreset(e.target.value)} defaultValue="">
              <option value="">— escolher preset —</option>
              {MED_PRESETS.map(p => (
                <option key={p.name} value={p.name}>{p.name} {p.brandName ? `(${p.brandName})` : ''}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nome</label>
              <input className="input text-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Tirzepatida" />
            </div>
            <div>
              <label className="label">Categoria</label>
              <select className="input text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="glp1">GLP-1/GIP (Mounjaro, Ozempic)</option>
                <option value="trt">TRT (Testosterona)</option>
                <option value="aas">AAS</option>
                <option value="serm">SERM (Clomid, Nolvadex)</option>
                <option value="ai">AI (Anastrozol, Letrozol)</option>
                <option value="hcg">hCG</option>
                <option value="hormone">Hormônio (T4, T3)</option>
                <option value="vitamin">Suplemento/Vitamina</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div>
              <label className="label">Dose</label>
              <input className="input text-sm" type="number" value={form.doseAmount} onChange={e => setForm(f => ({ ...f, doseAmount: e.target.value }))} step={0.5} placeholder="2.5" />
            </div>
            <div>
              <label className="label">Unidade</label>
              <select className="input text-sm" value={form.doseUnit} onChange={e => setForm(f => ({ ...f, doseUnit: e.target.value }))}>
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="UI">UI</option>
                <option value="ml">ml</option>
                <option value="g">g</option>
                <option value="comp">comprimido(s)</option>
              </select>
            </div>
            <div>
              <label className="label">Frequência</label>
              <select className="input text-sm" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                <option value="daily">Diária</option>
                <option value="twice_daily">2× ao dia</option>
                <option value="three_daily">3× ao dia</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quinzenal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            {form.frequency === 'weekly' && (
              <div>
                <label className="label">Dia da semana</label>
                <select className="input text-sm" value={form.weekday} onChange={e => setForm(f => ({ ...f, weekday: e.target.value }))}>
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d, i) => (
                    <option key={i} value={i}>{d}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="label">Horário</label>
              <input className="input text-sm" type="time" value={form.timeOfDay} onChange={e => setForm(f => ({ ...f, timeOfDay: e.target.value }))} />
            </div>
            <div>
              <label className="label">Início</label>
              <input className="input text-sm" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
          </div>

          <textarea className="input text-sm" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observações..." />

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={pending || !form.name || !form.doseAmount} className="btn-primary flex-1 text-sm">Salvar</button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost text-sm">Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          <Plus size={18} /> Adicionar medicamento
        </button>
      )}
    </div>
  );
}
