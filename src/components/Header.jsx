import { Clock, TrendingUp } from "lucide-react";

export default function Header() {
  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">India Pre-Market Edge</h1>
            <p className="text-slate-600 text-sm">Actionable ideas before the bell</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="h-4 w-4" />
          <span>{dateStr}</span>
        </div>
      </div>
    </header>
  );
}
