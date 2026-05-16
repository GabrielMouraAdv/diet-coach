'use client';

import { useState, useMemo } from 'react';
import { estimateBodyFat, BF_CATEGORY_LABEL } from '@/lib/nutrition';
import { Info } from 'lucide-react';

interface Props {
  sex: 'M' | 'F';
  weightKg?: number;
  /** callback quando o usuário aceita o valor calculado */
  onAccept?: (pct: number) => void;
  /** modo compacto: sem instruções, mais enxuto */
  compact?: boolean;
}

export function BodyFatCalculator({ sex, weightKg: defaultWeight, onAccept, compact = false }: Props) {
  const [weight, setWeight] = useState(defaultWeight?.toString() ?? '');
  const [abdomen, setAbdomen] = useState('');
  const [hip, setHip] = useState('');
  const [waist, setWaist] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const abd = parseFloat(abdomen);
    if (!w || !abd || w < 30 || abd < 40) return null;
    return estimateBodyFat({
      sex,
      weightKg: w,
      abdomenCm: abd,
      hipCm: parseFloat(hip) || undefined,
      waistCm: parseFloat(waist) || undefined,
    });
  }, [sex, weight, abdomen, hip, waist]);

  const catColor = result ? {
    essencial: 'text-blue-700 bg-blue-50 border-blue-200',
    atletico:  'text-brand-700 bg-brand-50 border-brand-200',
    fitness:   'text-green-700 bg-green-50 border-green-200',
    aceitavel: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    obeso:     'text-red-700 bg-red-50 border-red-200',
  }[result.category] : '';

  return (
    <div className="space-y-3">
      {!compact && (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Estimativa de % Gordura</p>
            <button type="button" onClick={() => setShowInfo(v => !v)} className="text-ink-400 hover:text-ink-600">
              <Info size={14} />
            </button>
          </div>
          {showInfo && (
            <div className="mt-2 rounded-xl bg-ink-50 border border-ink-200 p-3 text-xs text-ink-600 space-y-2">
              <p><strong>Como medir (use uma fita métrica flexível):</strong></p>
              <ul className="space-y-1 list-disc ml-4">
                <li><strong>Abdômen:</strong> ao nível do umbigo, em pé, relaxado, ao final de uma expiração normal.</li>
                <li><strong>Quadril:</strong> ponto mais largo do quadril (geralmente na altura da bunda).</li>
                <li><strong>Cintura:</strong> parte mais estreita do tronco (acima do umbigo, abaixo das costelas).</li>
              </ul>
              <p className="pt-1 border-t">
                <strong>Equação:</strong> Taylor KM et al., 2024 (validada em 1.904 militares com DXA como critério). Quanto mais medidas, mais preciso.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label text-xs">Peso (kg) *</label>
          <input className="input text-sm" type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="80" />
        </div>
        <div>
          <label className="label text-xs">Abdômen (cm) *</label>
          <input className="input text-sm" type="number" step="0.5" value={abdomen} onChange={e => setAbdomen(e.target.value)} placeholder="ex: 90" />
        </div>
        <div>
          <label className="label text-xs">Quadril (cm)</label>
          <input className="input text-sm" type="number" step="0.5" value={hip} onChange={e => setHip(e.target.value)} placeholder="opcional" />
        </div>
        <div>
          <label className="label text-xs">Cintura (cm)</label>
          <input className="input text-sm" type="number" step="0.5" value={waist} onChange={e => setWaist(e.target.value)} placeholder="opcional" />
        </div>
      </div>

      {!result && (
        <p className="text-xs text-ink-400">Preencha peso e abdômen para estimar.</p>
      )}

      {result && (
        <div className={`rounded-xl border p-3 ${catColor}`}>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-bold">{result.bodyFatPct}%</p>
              <p className="text-xs opacity-80">de gordura corporal</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-semibold">{BF_CATEGORY_LABEL[result.category]}</p>
              <p className="opacity-70">{result.sites}-sítio{result.sites > 1 ? 's' : ''}</p>
            </div>
          </div>
          {onAccept && (
            <button
              type="button"
              onClick={() => onAccept(result.bodyFatPct)}
              className="btn-primary text-xs w-full mt-3 py-1.5"
            >
              Usar {result.bodyFatPct}% no formulário
            </button>
          )}
          <p className="text-[10px] opacity-60 mt-2">Taylor KM et al., 2024. Margem de erro ≈ ±3-4 %BF.</p>
        </div>
      )}
    </div>
  );
}
