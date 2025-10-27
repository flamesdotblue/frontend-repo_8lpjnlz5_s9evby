import React, { useMemo, useState } from 'react';
import SectorStocksHeader from './components/SectorStocksHeader';
import SectorSelector from './components/SectorSelector';
import StocksGrid from './components/StocksGrid';

function randomHistory(n, base, vol = 1.2) {
  const arr = [base];
  for (let i = 1; i < n; i++) {
    const drift = (Math.random() - 0.5) * vol;
    arr.push(Math.max(1, arr[i - 1] + drift));
  }
  return arr;
}

function makeStock({ sector, symbol, name, price, change = (Math.random() * 2 - 1) * 2, volume = 5_000_000, low52, high52, update }) {
  const history = randomHistory(40, price * (1 - change / 100), 2);
  return { sector, symbol, name, price, change, volume, low52, high52, update, history };
}

function generateSectors() {
  const sectors = [
    {
      name: 'Information Technology',
      stocks: [
        makeStock({ sector: 'Information Technology', symbol: 'TCS', name: 'Tata Consultancy Services', price: 3900, change: 0.8, volume: 3_200_000, low52: 3000, high52: 4200, update: 'Announced a large multi-year deal in banking; order book outlook remains strong with stable margins.' }),
        makeStock({ sector: 'Information Technology', symbol: 'INFY', name: 'Infosys', price: 1600, change: -0.6, volume: 4_500_000, low52: 1200, high52: 1720, update: 'Guidance maintained; ramp-ups in cloud and digital offset soft discretionary spends.' }),
        makeStock({ sector: 'Information Technology', symbol: 'WIPRO', name: 'Wipro', price: 480, change: 0.4, volume: 6_100_000, low52: 360, high52: 520, update: 'Cost optimization aids margins; deal pipeline improving in Q4 verticals.' }),
        makeStock({ sector: 'Information Technology', symbol: 'HCLTECH', name: 'HCL Technologies', price: 1560, change: 1.2, volume: 2_800_000, low52: 1040, high52: 1625, update: 'Services growth steady; products business tracks seasonality with better conversion.' }),
      ],
    },
    {
      name: 'Banking & Financials',
      stocks: [
        makeStock({ sector: 'Banking & Financials', symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1520, change: 0.5, volume: 12_400_000, low52: 1360, high52: 1720, update: 'NIMs stabilize; deposit growth healthy. Asset quality remains resilient.' }),
        makeStock({ sector: 'Banking & Financials', symbol: 'ICICIBANK', name: 'ICICI Bank', price: 980, change: 0.9, volume: 9_200_000, low52: 820, high52: 1045, update: 'Retail book momentum; strong fee income. Credit cost guidance unchanged.' }),
        makeStock({ sector: 'Banking & Financials', symbol: 'SBIN', name: 'State Bank of India', price: 780, change: -0.3, volume: 14_900_000, low52: 520, high52: 820, update: 'Moderation in treasury gains; loan growth steady with stable opex trajectory.' }),
        makeStock({ sector: 'Banking & Financials', symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1720, change: 0.2, volume: 3_900_000, low52: 1550, high52: 1880, update: 'Deposit repricing underway; CASA mix focus continues; operating metrics stable.' }),
      ],
    },
    {
      name: 'Pharmaceuticals & Healthcare',
      stocks: [
        makeStock({ sector: 'Pharmaceuticals & Healthcare', symbol: 'SUNPHARMA', name: 'Sun Pharma', price: 1380, change: 0.7, volume: 5_400_000, low52: 960, high52: 1420, update: 'Specialty portfolio gaining traction; US pipeline visibility improving.' }),
        makeStock({ sector: 'Pharmaceuticals & Healthcare', symbol: 'CIPLA', name: 'Cipla', price: 1260, change: -0.4, volume: 3_200_000, low52: 980, high52: 1300, update: 'Domestic respiratory portfolio steady; US launches offset price erosion.' }),
        makeStock({ sector: 'Pharmaceuticals & Healthcare', symbol: 'DRREDDY', name: 'Dr. Reddy’s Laboratories', price: 6000, change: 1.1, volume: 1_200_000, low52: 4450, high52: 6250, update: 'Strong launch momentum in US generics; margins expand on product mix.' }),
        makeStock({ sector: 'Pharmaceuticals & Healthcare', symbol: 'DIVISLAB', name: "Divi's Laboratories", price: 4300, change: 0.3, volume: 800_000, low52: 3220, high52: 4500, update: 'Custom synthesis inquiries improving; recovery visible in export orders.' }),
      ],
    },
    {
      name: 'Automobile & Auto Ancillaries',
      stocks: [
        makeStock({ sector: 'Automobile & Auto Ancillaries', symbol: 'TATAMOTORS', name: 'Tata Motors', price: 935, change: 1.6, volume: 18_000_000, low52: 470, high52: 980, update: 'JLR order book healthy; PV mix supportive; EV ramp-up on plan.' }),
        makeStock({ sector: 'Automobile & Auto Ancillaries', symbol: 'MARUTI', name: 'Maruti Suzuki', price: 12250, change: -0.2, volume: 1_000_000, low52: 8200, high52: 12500, update: 'New launches pipeline; semiconductor supply normalizing; margins steady.' }),
        makeStock({ sector: 'Automobile & Auto Ancillaries', symbol: 'EICHERMOT', name: 'Eicher Motors', price: 4160, change: 0.9, volume: 700_000, low52: 2800, high52: 4300, update: 'Premiumization supports ASP; exports traction continues.' }),
        makeStock({ sector: 'Automobile & Auto Ancillaries', symbol: 'M&M', name: 'Mahindra & Mahindra', price: 1880, change: 0.4, volume: 4_600_000, low52: 1140, high52: 1960, update: 'SUV demand robust; farm segment stabilizing; capex on EV platform.' }),
      ],
    },
    {
      name: 'Energy & Utilities',
      stocks: [
        makeStock({ sector: 'Energy & Utilities', symbol: 'RELIANCE', name: 'Reliance Industries', price: 2960, change: 0.5, volume: 8_700_000, low52: 2200, high52: 3030, update: 'Retail and Jio drive consolidated growth; energy cycle supportive.' }),
        makeStock({ sector: 'Energy & Utilities', symbol: 'ONGC', name: 'Oil & Natural Gas Corp', price: 270, change: -0.8, volume: 10_200_000, low52: 145, high52: 295, update: 'Crude volatility impacts realizations; exploration pipeline intact.' }),
        makeStock({ sector: 'Energy & Utilities', symbol: 'NTPC', name: 'NTPC', price: 350, change: 0.7, volume: 9_500_000, low52: 160, high52: 370, update: 'Thermal PLF strong; renewables commissioning on schedule.' }),
        makeStock({ sector: 'Energy & Utilities', symbol: 'POWERGRID', name: 'Power Grid Corp', price: 300, change: 0.3, volume: 6_800_000, low52: 185, high52: 315, update: 'Interstate transmission additions; stable regulated returns.' }),
      ],
    },
    {
      name: 'FMCG & Consumer',
      stocks: [
        makeStock({ sector: 'FMCG & Consumer', symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2530, change: 0.1, volume: 3_300_000, low52: 2250, high52: 2680, update: 'Rural recovery gradual; mix and pricing stabilize; margins see tailwinds.' }),
        makeStock({ sector: 'FMCG & Consumer', symbol: 'ITC', name: 'ITC', price: 440, change: 0.6, volume: 19_400_000, low52: 375, high52: 499, update: 'Hotels and FMCG sustain growth; cig volumes stable; capex calibrated.' }),
        makeStock({ sector: 'FMCG & Consumer', symbol: 'NESTLEIND', name: 'Nestlé India', price: 24800, change: -0.5, volume: 120_000, low52: 17850, high52: 25900, update: 'Volume-led growth; input costs normalize; rural distribution expansion.' }),
        makeStock({ sector: 'FMCG & Consumer', symbol: 'DABUR', name: 'Dabur', price: 520, change: 0.4, volume: 4_200_000, low52: 470, high52: 590, update: 'Healthcare portfolio healthy; international business supports growth.' }),
      ],
    },
    {
      name: 'Metals & Mining',
      stocks: [
        makeStock({ sector: 'Metals & Mining', symbol: 'TATASTEEL', name: 'Tata Steel', price: 145, change: 0.9, volume: 28_000_000, low52: 95, high52: 155, update: 'Europe turnaround aided by spreads; India volumes solid.' }),
        makeStock({ sector: 'Metals & Mining', symbol: 'HINDALCO', name: 'Hindalco', price: 570, change: -0.3, volume: 7_800_000, low52: 370, high52: 600, update: 'Novelis guidance steady; capex progressing; cost tailwinds visible.' }),
        makeStock({ sector: 'Metals & Mining', symbol: 'JSWSTEEL', name: 'JSW Steel', price: 900, change: 0.2, volume: 6_900_000, low52: 650, high52: 930, update: 'Domestic demand firm; exports recovering; commissioning on track.' }),
        makeStock({ sector: 'Metals & Mining', symbol: 'COALINDIA', name: 'Coal India', price: 460, change: 0.1, volume: 15_000_000, low52: 210, high52: 480, update: 'Dispatches robust; e-auction premiums ease; dividend clarity supportive.' }),
      ],
    },
  ];
  return sectors;
}

export default function App() {
  const [sectors, setSectors] = useState(generateSectors());
  const [selected, setSelected] = useState(sectors[0]);

  const onRefresh = () => {
    // jitter prices and changes for 1D feel, rotate history
    setSectors(prev => prev.map(sec => ({
      ...sec,
      stocks: sec.stocks.map(st => {
        const jitter = (Math.random() - 0.5) * 1.2; // +/-1.2%
        const newChange = Math.max(-5, Math.min(5, st.change + jitter));
        const newPrice = Math.max(1, st.price * (1 + jitter / 100));
        const newHist = [...st.history.slice(1), Math.max(1, st.history[st.history.length - 1] * (1 + jitter / 100))];
        return { ...st, price: newPrice, change: newChange, history: newHist };
      })
    })));
  };

  const selectedSector = useMemo(() => {
    if (!selected) return null;
    const fresh = sectors.find(s => s.name === selected.name);
    return fresh || selected;
  }, [sectors, selected]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SectorStocksHeader onRefresh={onRefresh} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <SectorSelector
            sectors={sectors}
            selectedSector={selectedSector}
            onSelect={setSelected}
          />
          <StocksGrid selectedSector={selectedSector} />
        </div>
      </main>
    </div>
  );
}
