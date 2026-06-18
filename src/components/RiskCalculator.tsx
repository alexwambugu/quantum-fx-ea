import React, { useState, useMemo } from 'react';
import { Calculator, Shield, AlertTriangle, DollarSign, Percent, ArrowRightLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface RiskCalculatorProps {
  currentSignal?: { type: 'BUY' | 'SELL' | 'NEUTRAL'; sl: number; entry: number } | null;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({ currentSignal }) => {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [slPips, setSlPips] = useState(30);
  const pipValue = 10; // $10 per standard lot pip on EURUSD

  const calculations = useMemo(() => {
    const riskAmount = balance * (riskPercent / 100);
    const lotSize = slPips > 0 ? riskAmount / (slPips * pipValue) : 0;
    const rrRatio = currentSignal
      ? Math.abs(currentSignal.entry - currentSignal.sl) * 10000
      : slPips;

    return {
      riskAmount,
      lotSize: Math.round(lotSize * 100) / 100,
      maxLoss: riskAmount,
      riskRewardRatio: `1:${(rrRatio > 0 ? (rrRatio / Math.max(slPips, 1)) * 2 : 0).toFixed(1)}`,
    };
  }, [balance, riskPercent, slPips, currentSignal]);

  const isHighRisk = riskPercent >= 3;
  const isLowRisk = riskPercent <= 1;

  return (
    <div className="p-6 rounded-xl border border-border bg-card/50">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Calculator size={16} /> Risk Management
        </h3>
        <div className={cn(
          "px-2 py-0.5 rounded text-[10px] font-black uppercase",
          isHighRisk ? "bg-rose-500/10 text-rose-500" : isLowRisk ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
        )}>
          {isHighRisk ? 'Aggressive' : isLowRisk ? 'Conservative' : 'Moderate'}
        </div>
      </div>

      <div className="space-y-4">
        {/* Account Balance */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <DollarSign size={10} /> Account Balance
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">$</span>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm font-bold tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Risk Percentage */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Percent size={10} /> Risk per Trade
          </label>
          <div className="flex gap-2">
            {[1, 2, 3].map(pct => (
              <button
                key={pct}
                onClick={() => setRiskPercent(pct)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                  riskPercent === pct
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                )}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Stop Loss Pips */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <ArrowRightLeft size={10} /> Stop Loss (Pips)
          </label>
          <input
            type="number"
            value={slPips}
            onChange={(e) => setSlPips(Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm font-bold tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Shield size={12} /> Max Risk Amount
              </span>
              <span className="font-bold tabular-nums text-rose-500">${calculations.riskAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Suggested Lot Size</span>
              <span className="font-black text-2xl tabular-nums">{calculations.lotSize.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Risk/Reward Ratio</span>
              <span className="font-bold tabular-nums text-emerald-500">{calculations.riskRewardRatio}</span>
            </div>
          </div>
        </div>

        {/* Warning */}
        {isHighRisk && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
            <AlertTriangle size={14} className="text-rose-500 mt-0.5 shrink-0" />
            <p className="text-[10px] text-rose-400 font-medium leading-relaxed">
              High risk detected. Consider reducing position size to protect your capital.
            </p>
          </div>
        )}

        {/* Execute Button */}
        <button
          disabled={!currentSignal || currentSignal.type === 'NEUTRAL'}
          className={cn(
            "w-full py-3 font-bold rounded-lg transition-all text-sm",
            currentSignal && currentSignal.type !== 'NEUTRAL'
              ? currentSignal.type === 'BUY'
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                : "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {currentSignal && currentSignal.type !== 'NEUTRAL'
            ? `Execute ${currentSignal.type} via MT5`
            : 'No Active Signal'
          }
        </button>
      </div>
    </div>
  );
};
