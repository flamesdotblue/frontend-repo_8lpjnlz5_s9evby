import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";

function SentimentBadge({ sentiment }) {
  const styles = {
    Bullish: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Bearish: "bg-rose-50 text-rose-700 border-rose-200",
    Neutral: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[sentiment] || styles.Neutral}`}>
      {sentiment}
    </span>
  );
}

function RecommendationCard({ rec }) {
  const isUp = rec.bias === "Long";
  return (
    <div className="bg-white/90 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">{rec.company} <span className="text-slate-400 font-normal">({rec.ticker})</span></h3>
            <SentimentBadge sentiment={rec.sentiment} />
          </div>
          <p className="text-sm text-slate-600 mt-1">Sector: {rec.sector} • Risk: {rec.risk}</p>
        </div>
        <div className={`flex items-center gap-1 ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
          {isUp ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
          <span className="font-semibold">{rec.bias}</span>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-slate-800">
          {rec.rationale}
        </p>
        <ul className="mt-2 text-sm text-slate-600 list-disc pl-5 space-y-1">
          {rec.signals.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {rec.keywords.map((k) => (
          <span key={k} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{k}</span>
        ))}
      </div>

      <div className="mt-3 text-xs text-slate-500 flex items-start gap-2">
        <Info className="h-4 w-4 shrink-0" />
        <p>Generated from latest public news and company updates. Educational use only.</p>
      </div>
    </div>
  );
}

export default function Recommendations({ items }) {
  if (!items.length) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <div className="text-center text-slate-600 bg-white/90 border border-slate-200 rounded-xl p-8">
          No ideas match the current filters.
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 space-y-4">
      {items.map((rec) => (
        <RecommendationCard key={rec.ticker} rec={rec} />
      ))}
    </section>
  );
}
