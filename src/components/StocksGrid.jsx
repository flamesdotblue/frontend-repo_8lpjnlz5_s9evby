import React, { useMemo, useState } from 'react';
import StockCard from './StockCard';
import { Search } from 'lucide-react';

export default function StocksGrid({ selectedSector }) {
  const [query, setQuery] = useState('');

  const stocks = selectedSector?.stocks || [];
  const filtered = useMemo(() => {
    return stocks.filter(s =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [stocks, query]);

  return (
    <section className="flex-1">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{selectedSector ? selectedSector.name : 'Select a sector'}</h2>
            <p className="text-sm text-gray-500">{filtered.length} results</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stocks"
              className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
        {selectedSector && filtered.length === 0 && (
          <div className="mt-8 text-sm text-gray-500">No stocks match your search.</div>
        )}
        {!selectedSector && (
          <div className="mt-8 text-sm text-gray-500">Pick a sector on the left to see its stocks.</div>
        )}
      </div>
    </section>
  );
}
