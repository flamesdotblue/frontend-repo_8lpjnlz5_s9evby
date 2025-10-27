import { Newspaper } from "lucide-react";

export default function NewsFeed({ items }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
      <div className="bg-white/90 border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700 mb-3">
          <Newspaper className="h-4 w-4" />
          <h2 className="font-medium">Latest headlines influencing sentiment</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {items.map((n, idx) => (
            <article key={idx} className="py-3">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-medium text-slate-900 leading-snug">{n.title}</h3>
                <span className="text-xs text-slate-500 whitespace-nowrap">{n.time}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{n.source} • {n.category}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
