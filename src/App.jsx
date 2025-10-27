import React, { useMemo, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import SectorFilters from './components/SectorFilters';
import PerformanceSummary from './components/PerformanceSummary';
import SectorPerformanceGrid from './components/SectorPerformanceGrid';

const INITIAL_SECTORS = [
  {
    name: 'Banking & Financials',
    change1d: 0.85,
    change1w: 2.4,
    change1m: 4.9,
    volume: 324000000,
    advancers: 27,
    decliners: 13,
    history: [-0.3, 0.1, 0.2, 0.4, 0.1, 0.6, 0.85],
  },
  {
    name: 'IT & Services',
    change1d: -0.62,
    change1w: 1.1,
    change1m: -2.3,
    volume: 178000000,
    advancers: 14,
    decliners: 36,
    history: [0.5, 0.3, -0.4, -0.2, 0.1, -0.3, -0.62],
  },
  {
    name: 'Auto & Components',
    change1d: 1.12,
    change1w: 3.6,
    change1m: 6.1,
    volume: 98000000,
    advancers: 33,
    decliners: 7,
    history: [-0.2, 0.0, 0.2, 0.5, 0.7, 0.9, 1.12],
  },
  {
    name: 'Pharma & Healthcare',
    change1d: -0.34,
    change1w: -0.8,
    change1m: 1.2,
    volume: 72000000,
    advancers: 18,
    decliners: 22,
    history: [0.2, -0.1, -0.3, -0.2, -0.1, 0.1, -0.34],
  },
  {
    name: 'Energy & Oil',
    change1d: 0.18,
    change1w: -0.6,
    change1m: 2.1,
    volume: 141000000,
    advancers: 21,
    decliners: 19,
    history: [-0.5, -0.2, 0.0, 0.2, 0.1, 0.15, 0.18],
  },
  {
    name: 'Metals & Mining',
    change1d: -1.24,
    change1w: -2.9,
    change1m: -5.4,
    volume: 56000000,
    advancers: 9,
    decliners: 41,
    history: [0.4, -0.6, -0.9, -1.2, -0.8, -1.0, -1.24],
  },
  {
    name: 'FMCG',
    change1d: 0.42,
    change1w: 1.3,
    change1m: 2.7,
    volume: 86000000,
    advancers: 28,
    decliners: 12,
    history: [-0.1, 0.0, 0.2, 0.25, 0.3, 0.35, 0.42],
  },
  {
    name: 'Realty',
    change1d: -0.15,
    change1w: 0.4,
    change1m: 3.2,
    volume: 30000000,
    advancers: 16,
    decliners: 14,
    history: [-0.3, -0.2, 0.1, 0.4, 0.2, -0.1, -0.15],
  },
];

export default function App() {
  const [timeframe, setTimeframe] = useState('1D');
  const [query, setQuery] = useState('');
  const [showPerformers, setShowPerformers] = useState(true);
  const [showLaggards, setShowLaggards] = useState(true);
  const [sectors, setSectors] = useState(INITIAL_SECTORS);

  const getChg = (s) => (timeframe === '1M' ? s.change1m : timeframe === '1W' ? s.change1w : s.change1d);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sectors.filter((s) => {
      const chg = getChg(s);
      const isPerformer = chg >= 0;
      const include = (showPerformers && isPerformer) || (showLaggards && !isPerformer);
      const qok = !q || s.name.toLowerCase().includes(q);
      return include && qok;
    });
  }, [sectors, timeframe, query, showPerformers, showLaggards]);

  const handleRefresh = () => {
    // Lightly perturb changes to simulate a fresh pre-market tick
    setSectors((prev) =>
      prev.map((s) => {
        const jitter = (Math.random() - 0.5) * 0.3; // +/-0.15%
        const n1d = s.change1d + jitter;
        const nhist = [...s.history.slice(1), n1d];
        return { ...s, change1d: n1d, history: nhist };
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">
      <DashboardHeader onRefresh={handleRefresh} />
      <SectorFilters
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        query={query}
        setQuery={setQuery}
        showPerformers={showPerformers}
        setShowPerformers={setShowPerformers}
        showLaggards={showLaggards}
        setShowLaggards={setShowLaggards}
      />

      <PerformanceSummary sectors={filtered} timeframe={timeframe} />
      <SectorPerformanceGrid sectors={filtered} timeframe={timeframe} />

      <footer className="max-w-6xl mx-auto px-4 py-8 text-xs text-neutral-500">
        Pre-market educational snapshot. Not investment advice.
      </footer>
    </div>
  );
}
