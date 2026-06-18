import { useState, useEffect, useRef } from 'react';

export interface Tick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Signal {
  type: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  reason: string[];
}

export interface SMCData {
  orderBlocks: { price: number; type: 'bullish' | 'bearish'; time: number }[];
  fvgs: { top: number; bottom: number; time: number }[];
  bos: { price: number; time: number; type: 'bullish' | 'bearish' }[];
  choch: { price: number; time: number; type: 'bullish' | 'bearish' }[];
}

export const useSignalEngine = () => {
  const [data, setData] = useState<Tick[]>([]);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [smc, setSmc] = useState<SMCData>({ orderBlocks: [], fvgs: [], bos: [], choch: [] });
  const [indicators, setIndicators] = useState({
    ema50: 0,
    ema200: 0,
    ema800: 0,
    rsi: 50,
    macd: { line: 0, signal: 0, histogram: 0 },
    trend: 'Sideways' as 'Bullish' | 'Bearish' | 'Sideways',
    trendStrength: 0,
  });

  const lastPrice = useRef(1.1050); // EURUSD starting point

  // Generate initial data
  useEffect(() => {
    const initialData: Tick[] = [];
    let time = Math.floor(Date.now() / 1000) - 100 * 60;
    let price = 1.1050;

    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.5) * 0.001;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 0.0005;
      const low = Math.min(open, close) - Math.random() * 0.0005;
      
      initialData.push({
        time,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000) + 500,
      });
      price = close;
      time += 60;
    }
    setData(initialData);
    lastPrice.current = price;
  }, []);

  // Update real-time (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const nextTime = last.time + 60;
        // Introduce some momentum to simulate trends
        const momentum = (Math.random() - 0.48) * 0.0003; 
        const open = last.close;
        const close = open + momentum;
        const high = Math.max(open, close) + Math.random() * 0.0002;
        const low = Math.min(open, close) - Math.random() * 0.0002;

        const newData = [...prev.slice(1), {
          time: nextTime,
          open,
          high,
          low,
          close,
          volume: Math.floor(Math.random() * 1000) + 500,
        }];

        calculateIndicators(newData);
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const calculateIndicators = (ticks: Tick[]) => {
    if (ticks.length < 50) return;

    const closes = ticks.map(t => t.close);
    
    // EMA Calculation helper
    const calculateEMA = (values: number[], period: number) => {
      const k = 2 / (period + 1);
      let ema = values[0];
      for (let i = 1; i < values.length; i++) {
        ema = values[i] * k + ema * (1 - k);
      }
      return ema;
    };

    const ema50 = calculateEMA(closes, 50);
    const ema200 = calculateEMA(closes.slice(-100), 100); // Approximation
    const ema800 = calculateEMA(closes.slice(-150), 150); // Approximation

    // RSI Calculation
    const calculateRSI = (values: number[], period: number = 14) => {
      let gains = 0;
      let losses = 0;
      for (let i = values.length - period; i < values.length; i++) {
        const diff = values[i] - values[i - 1];
        if (diff > 0) gains += diff;
        else losses -= diff;
      }
      if (losses === 0) return 100;
      const rs = (gains / period) / (losses / period);
      return 100 - (100 / (1 + rs));
    };

    const rsi = calculateRSI(closes);

    // MACD (12, 26, 9)
    const ema12 = calculateEMA(closes, 12);
    const ema26 = calculateEMA(closes, 26);
    const macdLine = ema12 - ema26;
    const macdSignal = macdLine * 0.9 + (Math.random() - 0.5) * 0.0001; // Mock signal line

    const trend = ema50 > ema200 ? 'Bullish' : 'Bearish';
    const trendStrength = Math.min(100, Math.abs(ema50 - ema200) * 20000);

    setIndicators({
      ema50,
      ema200,
      ema800,
      rsi,
      macd: { line: macdLine, signal: macdSignal, histogram: macdLine - macdSignal },
      trend,
      trendStrength,
    });

    // Signal Logic
    const currentPrice = ticks[ticks.length - 1].close;
    
    let signal: Signal | null = null;
    const reasons: string[] = [];

    // BUY SIGNAL CONDITIONS
    const isBuy = 
      ema50 > ema200 && 
      currentPrice > ema200 && 
      rsi > 55 && 
      macdLine > macdSignal;

    if (isBuy) {
      reasons.push('EMA 50 > 200 crossover', 'Price above EMA 200', 'RSI Bullish (>55)', 'MACD Bullish Crossover');
      signal = {
        type: 'BUY',
        confidence: 85 + Math.random() * 10,
        entry: currentPrice,
        sl: currentPrice - 0.0030,
        tp1: currentPrice + 0.0030,
        tp2: currentPrice + 0.0060,
        reason: reasons
      };
    } 
    // SELL SIGNAL CONDITIONS
    else if (
      ema50 < ema200 && 
      currentPrice < ema200 && 
      rsi < 45 && 
      macdLine < macdSignal
    ) {
      reasons.push('EMA 50 < 200 crossover', 'Price below EMA 200', 'RSI Bearish (<45)', 'MACD Bearish Crossover');
      signal = {
        type: 'SELL',
        confidence: 85 + Math.random() * 10,
        entry: currentPrice,
        sl: currentPrice + 0.0030,
        tp1: currentPrice - 0.0030,
        tp2: currentPrice - 0.0060,
        reason: reasons
      };
    }

    setCurrentSignal(signal);

    // Mock SMC Detection
    const last3 = ticks.slice(-3);
    if (last3.length === 3 && last3[0].low > last3[1].high && last3[1].low > last3[2].high) {
      setSmc(prev => ({
        ...prev,
        fvgs: [...prev.fvgs.slice(-4), { top: last3[0].low, bottom: last3[2].high, time: last3[1].time }]
      }));
    }
  };

  return { data, currentSignal, indicators, smc };
};
