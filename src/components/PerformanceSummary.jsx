import React, { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function PerformanceSummary({ sectors, timeframe }) {
  const { performers, laggards, top, bottom } = useMemo(() => {
    const getChg = (s) => (timeframe === '1M' ? s.change1m : timeframe === '1W' ? s.change1w : s.change1d);
    const performers = sectors.filter((s) => getChg(s) >= 0);
    const laggards = sectors.filter((s) => getChg(s) < 0);
    const sorted = [...sectors].sort((a, b) => getChg(b) - getChg(a));
    return {
      performers,
      laggards,
      top: sorted.slice(0, 3),
      bottom: sorted.slice(-3).reverse(),
    };
  }, [sectors, timeframe]);

  const formatPct = (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <p className="text-sm text-neutral-500">Overview</p>
          <div className="mt-2 flex items-end gap-6">
            <div>
              <div className="text-2xl font-semibold">{performers.length}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Performing
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{laggards.length}</div>
              <div className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3" /> Not Performing
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <p className="text-sm text-neutral-500">Top Sectors</p>
          <ul className="mt-2 space-y-2">
            {top.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-emerald-600 dark:text-emerald-400">{formatPct(timeframe === '1M' ? s.change1m : timeframe === '1W' ? s.change1w : s.change1d)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <p className="text-sm text-neutral-500">Bottom Sectors</p>
          <ul className="mt-2 space-y-2">
            {bottom.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-rose-600 dark:text-rose-400">{formatPct(timeframe === '1M' ? s.change1m : timeframe === '1W' ? s.change1w : s.change1d)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
