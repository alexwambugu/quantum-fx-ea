import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickData, LineData, Time, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { Tick, SMCData } from '../hooks/useSignalEngine';

interface TradingChartProps {
  data: Tick[];
  indicators: {
    ema50: number;
    ema200: number;
    ema800: number;
  };
  smc: SMCData;
}

export const TradingChart: React.FC<TradingChartProps> = ({ data, indicators, smc }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const ema50SeriesRef = useRef<any>(null);
  const ema200SeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0a0a0a' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    const ema50Series = chart.addSeries(LineSeries, {
      color: '#3b82f6',
      lineWidth: 2,
      title: 'EMA 50',
    });

    const ema200Series = chart.addSeries(LineSeries, {
      color: '#f59e0b',
      lineWidth: 2,
      title: 'EMA 200',
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    ema50SeriesRef.current = ema50Series;
    ema200SeriesRef.current = ema200Series;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (candleSeriesRef.current && data.length > 0) {
      candleSeriesRef.current.setData(data as any as CandlestickData<Time>[]);
      
      const ema50Data: LineData<Time>[] = data.map((d) => ({
        time: d.time as Time,
        value: indicators.ema50 || d.close,
      }));
      
      const ema200Data: LineData<Time>[] = data.map((d) => ({
        time: d.time as Time,
        value: indicators.ema200 || d.close,
      }));

      ema50SeriesRef.current?.setData(ema50Data);
      ema200SeriesRef.current?.setData(ema200Data);
    }
  }, [data, indicators]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-card">
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur rounded-md border border-border">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-medium text-foreground">EMA 50: {indicators.ema50.toFixed(4)}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur rounded-md border border-border">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-xs font-medium text-foreground">EMA 200: {indicators.ema200.toFixed(4)}</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[500px]" />
      
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
         {smc.fvgs.length > 0 && (
           <div className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] border border-purple-500/30 rounded uppercase tracking-wider font-bold">
             Fair Value Gap Detected
           </div>
         )}
      </div>
    </div>
  );
};
