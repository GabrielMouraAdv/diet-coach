'use client';

interface Props {
  consumed: number;
  target: number;
  size?: number;
}

export function MacroRing({ consumed, target, size = 80 }: Props) {
  const pct = Math.min(100, (consumed / target) * 100);
  const r = (size / 2) - 8;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  const remaining = Math.max(0, target - consumed);
  const over = consumed > target;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={over ? '#ef4444' : '#16a34a'}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xs font-bold leading-none">{Math.round(pct)}%</p>
        <p className="text-[9px] text-ink-400 leading-none mt-0.5">{over ? 'excedido' : `${Math.round(remaining)} rest.`}</p>
      </div>
    </div>
  );
}
