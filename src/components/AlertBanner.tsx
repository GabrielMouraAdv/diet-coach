import type { Alert } from '@/lib/nutrition';

export function AlertBanner({ alert }: { alert: Alert }) {
  const styles = {
    info:   'bg-blue-50 border-blue-200 text-blue-800',
    warn:   'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  };
  const icons = { info: 'ℹ️', warn: '⚠️', danger: '🚨' };

  return (
    <div className={`flex gap-2 rounded-xl border px-3 py-2.5 text-sm ${styles[alert.level]}`}>
      <span className="flex-shrink-0">{icons[alert.level]}</span>
      <div>
        <p>{alert.message}</p>
        {alert.source && <p className="text-xs opacity-60 mt-0.5">{alert.source}</p>}
      </div>
    </div>
  );
}
