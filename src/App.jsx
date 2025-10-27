import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Filters from "./components/Filters";
import Recommendations from "./components/Recommendations";
import NewsFeed from "./components/NewsFeed";

function App() {
  const [sector, setSector] = useState("All");
  const [risk, setRisk] = useState("All");
  const [query, setQuery] = useState("");

  const [ideas, setIdeas] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_BACKEND_URL || "";
  const baseUrl = API || `${window.location.protocol}//${window.location.hostname}:8000`;

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [r1, r2] = await Promise.all([
          fetch(`${baseUrl}/api/recommendations`),
          fetch(`${baseUrl}/api/news`),
        ]);
        if (!r1.ok || !r2.ok) throw new Error("Failed to load data");
        const [recs, headlines] = await Promise.all([r1.json(), r2.json()]);
        if (!cancelled) {
          setIdeas(recs || []);
          setNews(headlines || []);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Unable to fetch the latest pre-market data right now.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  const filtered = useMemo(() => {
    return ideas.filter((i) => {
      const sectorOk = sector === "All" || i.sector === sector;
      const riskOk = risk === "All" || i.risk === risk;
      const q = query.trim().toLowerCase();
      const queryOk =
        !q ||
        i.company.toLowerCase().includes(q) ||
        i.ticker.toLowerCase().includes(q) ||
        (i.keywords || []).some((k) => k.toLowerCase().includes(q));
      return sectorOk && riskOk && queryOk;
    });
  }, [ideas, sector, risk, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <Header />

      <main className="pb-12">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-sky-600 text-white p-6 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold">Daily India Stock Recommendations</h2>
            <p className="mt-1 text-white/90">Curated from news, company updates, mergers and MoUs — designed to be ready before the market opens.</p>
          </div>
        </section>

        {error && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
            <div className="bg-rose-50 text-rose-800 border border-rose-200 rounded-xl p-4">
              {error}
            </div>
          </section>
        )}

        <Filters
          sector={sector}
          setSector={setSector}
          risk={risk}
          setRisk={setRisk}
          query={query}
          setQuery={setQuery}
        />

        {loading ? (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 space-y-4">
            <div className="animate-pulse bg-white/90 h-28 rounded-xl border border-slate-200" />
            <div className="animate-pulse bg-white/90 h-28 rounded-xl border border-slate-200" />
            <div className="animate-pulse bg-white/90 h-28 rounded-xl border border-slate-200" />
          </section>
        ) : (
          <>
            <Recommendations items={filtered} />
            <NewsFeed items={news} />
          </>
        )}

        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="text-xs text-slate-500 bg-white/70 border border-slate-200 rounded-xl p-4">
            These ideas are informational and not investment advice. Markets involve risks. Please do your own research or consult a licensed advisor.
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
