import React, { useMemo, useState } from 'react';
import { Search, CheckCircle2, Circle } from 'lucide-react';

export default function SectorSelector({ sectors, selectedSector, onSelect }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return sectors.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [sectors, query]);

  return (
    <aside className="w-full md:w-64 md:flex-shrink-0">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sectors"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <nav className="px-2 space-y-1">
        {filtered.map((sector) => {
          const avgChange = sector.stocks.reduce((a, b) => a + b.change, 0) / Math.max(1, sector.stocks.length);
          const performing = avgChange >= 0;
          const isActive = selectedSector?.name === sector.name;
          return (
            <button
              key={sector.name}
              onClick={() => onSelect(sector)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left hover:bg-gray-50 border ${isActive ? 'border-gray-300 bg-white shadow-sm' : 'border-transparent'}`}
            >
              <div>
                <div className="text-sm font-medium text-gray-900">{sector.name}</div>
                <div className="text-xs text-gray-500">{sector.stocks.length} stocks • {performing ? 'Performing' : 'Lagging'}</div>
              </div>
              {performing ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <Circle className="h-4 w-4 text-rose-500" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
