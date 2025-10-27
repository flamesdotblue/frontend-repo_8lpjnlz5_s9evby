import { useMemo, useState } from "react";
import { LineChart, Wand2, UploadCloud, Beaker, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Lightweight CSV parser for OHLCV
function parseCSV(text) {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((r) => r.split(/,|\t|\s+/).map((c) => c.trim()))
    .filter((r) => r.length >= 5);

  if (!rows.length) return [];

  // Determine header presence
  const headerLike = rows[0].some((c) => isNaN(parseFloat(c)) && /date|open|high|low|close|volume/i.test(c));
  const dataRows = headerLike ? rows.slice(1) : rows;

  // Try to map columns by common names; fallback to positional
  let idx = { date: 0, open: 1, high: 2, low: 3, close: 4, volume: 5 };
  if (headerLike) {
    const head = rows[0].map((h) => h.toLowerCase());
    const pick = (name, fallback) => {
      const i = head.findIndex((h) => h.includes(name));
      return i >= 0 ? i : fallback;
    };
    idx = {
      date: pick("date", 0),
      open: pick("open", 1),
      high: pick("high", 2),
      low: pick("low", 3),
      close: pick("close", 4),
      volume: pick("volume", 5),
    };
  }

  const out = [];
  for (const r of dataRows) {
    const o = parseFloat(r[idx.open]);
    const h = parseFloat(r[idx.high]);
    const l = parseFloat(r[idx.low]);
    const c = parseFloat(r[idx.close]);
    if ([o, h, l, c].some((v) => Number.isNaN(v))) continue;
    out.push({
      date: r[idx.date] || "",
      open: o,
      high: h,
      low: l,
      close: c,
      volume: parseFloat(r[idx.volume] || "0") || 0,
    });
  }
  return out;
}

// Indicators
function sma(values, period) {
  const res = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) res[i] = sum / period;
  }
  return res;
}

function ema(values, period) {
  const k = 2 / (period + 1);
  const res = new Array(values.length).fill(null);
  let prev = null;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    prev = prev == null ? v : v * k + prev * (1 - k);
    res[i] = i >= period - 1 ? prev : null;
  }
  return res;
}

function rsi(values, period = 14) {
  const res = new Array(values.length).fill(null);
  let gain = 0, loss = 0;
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const up = Math.max(change, 0);
    const down = Math.max(-change, 0);
    if (i <= period) {
      gain += up;
      loss += down;
      if (i === period) {
        const rs = (gain / period) / ((loss / period) || 1e-10);
        res[i] = 100 - 100 / (1 + rs);
      }
    } else {
      const prev = res[i - 1];
      // Wilder's smoothing
      gain = (gain * (period - 1) + up) / period;
      loss = (loss * (period - 1) + down) / period;
      const rs = gain / (loss || 1e-10);
      res[i] = 100 - 100 / (1 + rs);
    }
  }
  return res;
}

function stddev(values, period, i) {
  const start = i - period + 1;
  const window = values.slice(start, i + 1);
  const mean = window.reduce((a, b) => a + b, 0) / period;
  const variance = window.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
  return Math.sqrt(variance);
}

function bollinger(values, period = 20, mult = 2) {
  const m = sma(values, period);
  const upper = new Array(values.length).fill(null);
  const lower = new Array(values.length).fill(null);
  for (let i = 0; i < values.length; i++) {
    if (i >= period - 1) {
      const sd = stddev(values, period, i);
      upper[i] = m[i] + mult * sd;
      lower[i] = m[i] - mult * sd;
    }
  }
  return { middle: m, upper, lower };
}

function macd(values, fast = 12, slow = 26, signal = 9) {
  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  const line = values.map((_, i) => (emaFast[i] != null && emaSlow[i] != null ? emaFast[i] - emaSlow[i] : null));
  const valid = line.map((v) => (v == null ? null : v));
  // For signal EMA, we need to ignore leading nulls
  const filtered = valid.filter((v) => v != null);
  const sigFiltered = ema(filtered, signal);
  // Map back to original indexes
  const signalLine = new Array(values.length).fill(null);
  let idx = 0;
  for (let i = 0; i < valid.length; i++) {
    if (valid[i] == null) continue;
    signalLine[i] = sigFiltered[idx++];
  }
  const hist = line.map((v, i) => (v != null && signalLine[i] != null ? v - signalLine[i] : null));
  return { line, signal: signalLine, hist };
}

// Simple candlestick patterns on the latest bar
function detectPatterns(data) {
  if (data.length < 2) return [];
  const candles = data;
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const body = Math.abs(last.close - last.open);
  const range = last.high - last.low || 1e-9;
  const upperWick = last.high - Math.max(last.open, last.close);
  const lowerWick = Math.min(last.open, last.close) - last.low;

  const patterns = [];

  // Bullish Engulfing
  if (
    prev.close < prev.open &&
    last.close > last.open &&
    last.close >= prev.open &&
    last.open <= prev.close
  ) {
    patterns.push("Bullish Engulfing");
  }

  // Bearish Engulfing
  if (
    prev.close > prev.open &&
    last.close < last.open &&
    last.open >= prev.close &&
    last.close <= prev.open
  ) {
    patterns.push("Bearish Engulfing");
  }

  // Hammer
  if (lowerWick / range > 0.5 && upperWick / range < 0.2 && body / range < 0.3) {
    patterns.push("Hammer");
  }

  // Shooting Star
  if (upperWick / range > 0.5 && lowerWick / range < 0.2 && body / range < 0.3) {
    patterns.push("Shooting Star");
  }

  // Doji
  if (body / range < 0.05) {
    patterns.push("Doji");
  }

  return patterns;
}

function summarizeSignals(data) {
  if (!data.length) return { view: "Neutral", score: 0, reasons: [] };
  const closes = data.map((d) => d.close);
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const mac = macd(closes);
  const r = rsi(closes, 14);
  const bb = bollinger(closes, 20, 2);
  const sma20 = sma(closes, 20);
  const last = closes.length - 1;

  let score = 0;
  const reasons = [];

  if (ema12[last] != null && ema26[last] != null) {
    if (ema12[last] > ema26[last]) {
      score += 2; reasons.push("EMA12 above EMA26 (bullish trend)");
    } else {
      score -= 2; reasons.push("EMA12 below EMA26 (bearish trend)");
    }
  }

  if (mac.hist[last] != null && mac.signal[last] != null && mac.line[last] != null) {
    if (mac.line[last] > mac.signal[last]) {
      score += 1; reasons.push("MACD above signal");
    } else {
      score -= 1; reasons.push("MACD below signal");
    }
    // Momentum change
    const h2 = mac.hist[last - 1];
    if (h2 != null && mac.hist[last] != null) {
      if (mac.hist[last] > h2) {
        score += 0.5; reasons.push("MACD momentum improving");
      } else {
        score -= 0.5; reasons.push("MACD momentum weakening");
      }
    }
  }

  if (r[last] != null) {
    if (r[last] > 70) { score -= 1; reasons.push("RSI overbought (>70)"); }
    else if (r[last] < 30) { score += 1; reasons.push("RSI oversold (<30)"); }
    else if (r[last] >= 50) { score += 0.5; reasons.push("RSI above 50"); }
    else { score -= 0.5; reasons.push("RSI below 50"); }
  }

  if (sma20[last] != null) {
    if (closes[last] > sma20[last]) { score += 0.5; reasons.push("Price above 20SMA"); }
    else { score -= 0.5; reasons.push("Price below 20SMA"); }
  }

  if (bb.upper[last] != null && bb.lower[last] != null) {
    if (closes[last] > bb.upper[last]) { score -= 0.5; reasons.push("Price above upper Bollinger (stretched)"); }
    if (closes[last] < bb.lower[last]) { score += 0.5; reasons.push("Price below lower Bollinger (reversion)"); }
  }

  const patterns = detectPatterns(data);
  for (const p of patterns) {
    if (p.includes("Bullish") || p === "Hammer") { score += 0.75; reasons.push(`${p} pattern`); }
    if (p.includes("Bearish") || p === "Shooting Star") { score -= 0.75; reasons.push(`${p} pattern`); }
    if (p === "Doji") { reasons.push("Doji (indecision)"); }
  }

  // Normalize score to confidence 0-100
  const maxAbs = 6; // rough cap
  const confidence = Math.min(100, Math.round((Math.abs(score) / maxAbs) * 100));
  const view = score > 0.75 ? "Bullish" : score < -0.75 ? "Bearish" : "Neutral";

  return { view, score, confidence, reasons, rsi: r[last], macd: mac, ema12: ema12[last], ema26: ema26[last], sma20: sma20[last], bb: { upper: bb.upper[last], middle: bb.middle[last], lower: bb.lower[last] } };
}

function SampleButton({ onLoad }) {
  const sample = `date,open,high,low,close,volume\n2025-10-01,100,105,98,104,1200000\n2025-10-02,104,108,103,107,980000\n2025-10-03,107,110,105,109,880000\n2025-10-04,109,111,106,107,990000\n2025-10-07,107,112,106,111,1050000\n2025-10-08,111,114,110,113,940000\n2025-10-09,113,116,112,115,900000\n2025-10-10,115,118,114,117,880000\n2025-10-11,117,120,116,119,860000\n2025-10-14,119,121,118,120,840000\n2025-10-15,120,122,118,119,860000\n2025-10-16,119,121,117,118,870000\n2025-10-17,118,120,116,117,880000\n2025-10-18,117,119,115,116,890000\n2025-10-21,116,118,114,115,900000\n2025-10-22,115,117,113,114,910000\n2025-10-23,114,116,112,113,920000\n2025-10-24,113,115,111,114,930000\n2025-10-25,114,116,112,115,940000\n2025-10-28,115,118,114,117,950000\n2025-10-29,117,119,116,118,960000\n2025-10-30,118,121,117,120,970000`;
  return (
    <button onClick={() => onLoad(sample)} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
      <Beaker className="h-4 w-4" /> Load sample data
    </button>
  );
}

export default function TechnicalAnalyzer() {
  const [raw, setRaw] = useState("");
  const [ticker, setTicker] = useState("");

  const data = useMemo(() => parseCSV(raw).slice(-200), [raw]);
  const result = useMemo(() => summarizeSignals(data), [data]);

  const uploadFile = async (file) => {
    const txt = await file.text();
    setRaw(txt);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
      <div className="bg-white/90 border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-700">
            <LineChart className="h-4 w-4" />
            <h2 className="font-medium">Technical Analyzer</h2>
          </div>
          <SampleButton onLoad={setRaw} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="text-sm text-slate-500">Ticker (optional)</label>
            <input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="e.g., TCS" className="mt-1 w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-slate-500">Paste OHLCV data (CSV with columns: date, open, high, low, close, volume)</label>
            <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={6} className="mt-1 w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-xs" placeholder="date,open,high,low,close,volume" />
            <div className="mt-2 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <UploadCloud className="h-4 w-4" />
                <span>Upload CSV</span>
                <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files && e.target.files[0] && uploadFile(e.target.files[0])} />
              </label>
              <div className="text-xs text-slate-500">We compute EMA12/26, MACD(12,26,9), RSI(14), Bollinger(20,2), and basic candlestick patterns locally in your browser.</div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Wand2 className="h-4 w-4" />
                <h3 className="font-medium">Prediction</h3>
              </div>
              {data.length ? (
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    {result.view === 'Bullish' && <ArrowUpRight className="h-5 w-5 text-emerald-600" />} 
                    {result.view === 'Bearish' && <ArrowDownRight className="h-5 w-5 text-rose-600" />} 
                    <span className={result.view === 'Bullish' ? 'text-emerald-700' : result.view === 'Bearish' ? 'text-rose-700' : 'text-slate-700'}>{result.view}</span>
                    <span className="text-slate-500 text-sm">{result.confidence}% confidence</span>
                  </div>
                  <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
                    {result.reasons.map((r, i) => (<li key={i}>{r}</li>))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-slate-600">Paste or upload data to see indicators and a calculated view.</p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-medium text-slate-700 mb-2">Key Indicators (latest)</h3>
              {data.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="text-slate-600">RSI(14)</div>
                    <div className="text-emerald-700 font-semibold">{result.rsi?.toFixed(2)}</div>
                  </div>
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                    <div className="text-slate-600">EMA12 / EMA26</div>
                    <div className="text-sky-700 font-semibold">{Number(result.ema12)?.toFixed(2)} / {Number(result.ema26)?.toFixed(2)}</div>
                  </div>
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
                    <div className="text-slate-600">SMA20</div>
                    <div className="text-violet-700 font-semibold">{Number(result.sma20)?.toFixed(2)}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-slate-600">Bollinger 20,2</div>
                    <div className="text-amber-700 font-semibold">{Number(result.bb?.lower)?.toFixed(2)} - {Number(result.bb?.middle)?.toFixed(2)} - {Number(result.bb?.upper)?.toFixed(2)}</div>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 sm:col-span-2">
                    <div className="text-slate-600">MACD(12,26,9)</div>
                    <div className="text-rose-700 font-semibold">Line/Signal/Hist: {Number(result.macd?.line?.at(-1) ?? NaN).toFixed(4)} / {Number(result.macd?.signal?.at(-1) ?? NaN).toFixed(4)} / {Number(result.macd?.hist?.at(-1) ?? NaN).toFixed(4)}</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600">Indicators will appear once data is provided.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 rounded-xl border border-slate-200 p-4">
            <h3 className="font-medium text-slate-700 mb-2">Data preview</h3>
            {data.length ? (
              <div className="text-xs text-slate-700 max-h-72 overflow-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pr-3 py-1">Date</th>
                      <th className="pr-3 py-1">O</th>
                      <th className="pr-3 py-1">H</th>
                      <th className="pr-3 py-1">L</th>
                      <th className="pr-3 py-1">C</th>
                      <th className="pr-3 py-1">V</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(-50).map((d, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="pr-3 py-1 whitespace-nowrap">{d.date}</td>
                        <td className="pr-3 py-1">{d.open}</td>
                        <td className="pr-3 py-1">{d.high}</td>
                        <td className="pr-3 py-1">{d.low}</td>
                        <td className="pr-3 py-1 font-medium">{d.close}</td>
                        <td className="pr-3 py-1">{d.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-600">No rows parsed yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
