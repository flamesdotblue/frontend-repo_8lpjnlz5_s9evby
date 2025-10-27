import { useMemo, useState } from "react";
import Header from "./components/Header";
import Filters from "./components/Filters";
import Recommendations from "./components/Recommendations";
import NewsFeed from "./components/NewsFeed";

function App() {
  const [sector, setSector] = useState("All");
  const [risk, setRisk] = useState("All");
  const [query, setQuery] = useState("");

  // Mocked pre-market ideas. In a future iteration, this can be powered by a backend that aggregates news and filings.
  const ideas = [
    {
      company: "Reliance Industries",
      ticker: "RELIANCE",
      sector: "Energy",
      risk: "Medium",
      bias: "Long",
      sentiment: "Bullish",
      rationale:
        "Positive traction from retail and telecom arms, alongside steady energy margins. Recent partnership updates support growth narrative.",
      signals: [
        "Retail expansion update and subscriber additions",
        "Stable GRMs; energy complex supportive",
        "Optimism in diversified revenue streams",
      ],
      keywords: ["Retail", "Telecom", "Margins"],
    },
    {
      company: "Tata Consultancy Services",
      ticker: "TCS",
      sector: "IT",
      risk: "Low",
      bias: "Long",
      sentiment: "Neutral",
      rationale:
        "Muted near-term outlook priced in; improving deal pipeline and currency tailwinds could aid open.",
      signals: [
        "Large deal wins commentary",
        "INR tailwind vs USD",
        "Valuation support at current levels",
      ],
      keywords: ["Orderbook", "Currency", "Valuation"],
    },
    {
      company: "HDFC Bank",
      ticker: "HDFCBANK",
      sector: "Banking",
      risk: "Medium",
      bias: "Long",
      sentiment: "Bullish",
      rationale:
        "Update on deposit growth and NIM stabilisation improves sentiment ahead of session.",
      signals: [
        "Deposit growth commentary",
        "Asset quality stable",
        "Liquidity conditions supportive",
      ],
      keywords: ["NIM", "Deposits", "Asset Quality"],
    },
    {
      company: "Zee Entertainment",
      ticker: "ZEEL",
      sector: "Media",
      risk: "High",
      bias: "Short",
      sentiment: "Bearish",
      rationale:
        "Merger overhang and regulatory uncertainty could weigh on open; headline risk elevated.",
      signals: [
        "Merger timeline questions",
        "Regulatory clarity pending",
        "Volatility elevated on newsflow",
      ],
      keywords: ["Merger", "Regulatory", "Volatility"],
    },
    {
      company: "Sun Pharma",
      ticker: "SUNPHARMA",
      sector: "Pharma",
      risk: "Low",
      bias: "Long",
      sentiment: "Bullish",
      rationale:
        "Favorable update on specialty pipeline and US market traction; defensives in favour pre-open.",
      signals: [
        "US pipeline progress",
        "Specialty portfolio momentum",
        "Healthcare rotation",
      ],
      keywords: ["Specialty", "US Markets", "Defensive"],
    },
  ];

  const news = [
    {
      title: "Oil prices steady; OMCs watch margins into open",
      source: "Business Standard",
      category: "Commodities",
      time: "7:42 AM"
    },
    {
      title: "IT services signal improving deal pipeline in Q3 commentary",
      source: "ET Markets",
      category: "Technology",
      time: "7:35 AM"
    },
    {
      title: "Banking system liquidity eases; deposit growth stabilises",
      source: "Mint",
      category: "Banking",
      time: "7:20 AM"
    },
    {
      title: "Pharma exporters see traction in US launches this month",
      source: "Financial Express",
      category: "Healthcare",
      time: "7:05 AM"
    },
  ];

  const filtered = useMemo(() => {
    return ideas.filter((i) => {
      const sectorOk = sector === "All" || i.sector === sector;
      const riskOk = risk === "All" || i.risk === risk;
      const q = query.trim().toLowerCase();
      const queryOk = !q ||
        i.company.toLowerCase().includes(q) ||
        i.ticker.toLowerCase().includes(q) ||
        i.keywords.some((k) => k.toLowerCase().includes(q));
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

        <Filters
          sector={sector}
          setSector={setSector}
          risk={risk}
          setRisk={setRisk}
          query={query}
          setQuery={setQuery}
        />

        <Recommendations items={filtered} />
        <NewsFeed items={news} />

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
