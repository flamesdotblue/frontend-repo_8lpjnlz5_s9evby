import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function Sparkline({ data = [], positive }) {
  if (!data.length) return null;
  const width = 120;
  const height = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        fill="none"
        stroke={positive ? '#059669' : '#e11d48'}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}

export default function SectorPerformanceGrid({ sectors, timeframe }) {
  const formatPct = (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
  const getChg = (s) => (timeframe === '1M' ? s.change1m : timeframe === '1W' ? s.change1w : s.change1d);

  return (
    <section className="max-w-6xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((s) => {
          const chg = getChg(s);
          const positive = chg >= 0;
          return (
            <div
              key={s.name}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-sm transition"
              role="region"
              aria-label={`${s.name} ${positive ? 'performing' : 'not performing'} ${formatPct(chg)}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className={`text-sm mt-1 ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>{formatPct(chg)}</p>
                </div>
                <div className={`p-2 rounded-md ${positive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300'}`}>
                  {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
              </div>
              <div className="mt-3">
                <Sparkline data={s.history} positive={positive} />
              </div>
              <div className="mt-3 text-xs text-neutral-500">
                Vol: {Intl.NumberFormat(undefined, { notation: 'compact' }).format(s.volume)} • Adv/Dec: {s.advancers}:{s.decliners}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
