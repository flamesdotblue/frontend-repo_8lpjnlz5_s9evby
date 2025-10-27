import React, { useState } from 'react';

function Sparkline({ data = [], positive = true }) {
  if (!data.length) return null;
  const width = 180;
  const height = 56;
  const padding = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const scaleX = (i) => padding + (i * (width - 2 * padding)) / (data.length - 1);
  const scaleY = (v) => {
    if (max === min) return height / 2;
    return height - padding - ((v - min) * (height - 2 * padding)) / (max - min);
  };
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(v)}`).join(' ');
  const last = data[data.length - 1];

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity="0.4" />
          <stop offset="100%" stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke={positive ? '#10b981' : '#ef4444'} strokeWidth="2" />
      <path d={`${path} L ${scaleX(data.length - 1)} ${height - padding} L ${scaleX(0)} ${height - padding} Z`} fill="url(#grad)" opacity="0.3" />
      <circle cx={scaleX(data.length - 1)} cy={scaleY(last)} r="2.5" fill={positive ? '#10b981' : '#ef4444'} />
    </svg>
  );
}

export default function StockCard({ stock }) {
  const positive = stock.change >= 0;
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-indigo-500">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">{stock.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{stock.symbol}</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">{stock.sector}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">₹{stock.price.toFixed(2)}</div>
          <div className={`text-sm ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>{positive ? '+' : ''}{stock.change.toFixed(2)}%</div>
        </div>
      </div>
      <div className="mt-3">
        <Sparkline data={stock.history} positive={positive} />
      </div>
      <div className="mt-3">
        <div className="text-xs uppercase tracking-wide text-gray-500">Company Update</div>
        <p className={`mt-1 text-sm text-gray-700 leading-relaxed ${expanded ? '' : 'max-h-12 overflow-hidden'}`}>{stock.update}</p>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
        <span>Vol: {Intl.NumberFormat('en-IN', { notation: 'compact' }).format(stock.volume)}</span>
        <span>52W: ₹{stock.low52.toFixed(0)} - ₹{stock.high52.toFixed(0)}</span>
      </div>
    </div>
  );
}
