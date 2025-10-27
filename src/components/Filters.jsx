import { Filter } from "lucide-react";

export default function Filters({ sector, setSector, risk, setRisk, query, setQuery }) {
  const sectors = ["All", "Banking", "IT", "Energy", "Pharma", "Auto", "FMCG", "Metals"];
  const risks = ["All", "Low", "Medium", "High"];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
      <div className="bg-white/90 border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700 mb-3">
          <Filter className="h-4 w-4" />
          <h2 className="font-medium">Refine ideas</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-sm text-slate-500">Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="mt-1 w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500">Risk</label>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="mt-1 w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {risks.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-slate-500">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Company, ticker, or keyword"
              className="mt-1 w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
