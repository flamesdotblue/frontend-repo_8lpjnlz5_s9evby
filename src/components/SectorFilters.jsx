import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function SectorFilters({
  timeframe,
  setTimeframe,
  query,
  setQuery,
  showPerformers,
  setShowPerformers,
  showLaggards,
  setShowLaggards,
}) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2">
          <Search className="w-4 h-4 text-neutral-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sector..."
            className="w-full bg-transparent outline-none text-sm"
            aria-label="Search sectors"
          />
        </div>

        <div className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2">
          <Filter className="w-4 h-4 text-neutral-500" />
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
            aria-label="Select timeframe"
          >
            <option value="1D">1D</option>
            <option value="1W">1W</option>
            <option value="1M">1M</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-3 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showPerformers}
              onChange={(e) => setShowPerformers(e.target.checked)}
            />
            Performing
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showLaggards}
              onChange={(e) => setShowLaggards(e.target.checked)}
            />
            Not Performing
          </label>
        </div>
      </div>
    </section>
  );
}
