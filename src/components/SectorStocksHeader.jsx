import React from 'react';
import { RefreshCw, CalendarDays } from 'lucide-react';

export default function SectorStocksHeader({ onRefresh }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white grid place-items-center font-semibold">IN</div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">India Sector Stocks</h1>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> {today} • Pre-market dashboard
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2 text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          aria-label="Refresh data"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>
    </div>
  );
}
