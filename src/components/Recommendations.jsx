import { useMemo, useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Info, X, Newspaper, RefreshCcw, Search } from "lucide-react";

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

function RecommendationCard({ rec, onOpen }) {
  const isUp = rec.bias === "Long";
  return (
    <button
      onClick={() => onOpen(rec)}
      className="text-left w-full bg-white/90 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
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
          {(rec.signals || []).map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(rec.keywords || []).map((k) => (
          <span key={k} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{k}</span>
        ))}
      </div>

      <div className="mt-3 text-xs text-slate-500 flex items-start gap-2">
        <Info className="h-4 w-4 shrink-0" />
        <p>Generated from latest public news and company updates. Educational use only.</p>
      </div>
    </button>
  );
}

function DetailSheet({ open, onClose, rec, relatedNews }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !rec) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/40" aria-hidden="true" />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{rec.company} <span className="text-slate-500 font-normal">({rec.ticker})</span></h3>
            <p className="text-sm text-slate-600 mt-0.5">{rec.sector} • {rec.risk} • <span className="font-medium">{rec.bias}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-4 overflow-y-auto">
          <div className="mb-4">
            <h4 className="font-medium">Rationale</h4>
            <p className="text-sm text-slate-700 mt-1">{rec.rationale}</p>
            <ul className="mt-2 text-sm text-slate-600 list-disc pl-5 space-y-1">
              {(rec.signals || []).map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              {(rec.keywords || []).map((k) => (
                <span key={k} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{k}</span>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <Newspaper className="h-4 w-4" />
              <h4 className="font-medium">Related updates</h4>
            </div>
            {relatedNews.length ? (
              <ul className="space-y-3">
                {relatedNews.map((n, idx) => (
                  <li key={idx} className="border border-slate-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{n.source} • {n.category} • {n.time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">No specific headlines matched this ticker. Check broader news below.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Recommendations({ items, news, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [localQuery, setLocalQuery] = useState("");

  const onOpen = (rec) => {
    setActive(rec);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setActive(null);
  };

  const shown = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      i.company.toLowerCase().includes(q) ||
      i.ticker.toLowerCase().includes(q) ||
      (i.keywords || []).some((k) => k.toLowerCase().includes(q))
    );
  }, [items, localQuery]);

  const related = useMemo(() => {
    if (!active) return [];
    const tick = (n) => (n.tickers || []).map((t) => t.toLowerCase());
    return (news || []).filter((n) => tick(n).includes((active.ticker || "").toLowerCase()));
  }, [active, news]);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-700">
          <Search className="h-4 w-4" />
          <h2 className="font-medium">Ideas</h2>
        </div>
        <button onClick={onRefresh} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="mb-3">
        <input
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Quick search in results"
          className="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {!shown.length ? (
        <div className="text-center text-slate-600 bg-white/90 border border-slate-200 rounded-xl p-8">
          No ideas match the current filters.
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((rec) => (
            <RecommendationCard key={rec.ticker} rec={rec} onOpen={onOpen} />
          ))}
        </div>
      )}

      <DetailSheet open={open} onClose={onClose} rec={active} relatedNews={related} />
    </section>
  );
}
