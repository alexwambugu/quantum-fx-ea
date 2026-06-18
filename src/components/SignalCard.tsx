import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Target, ShieldCheck } from 'lucide-react';
import { Signal } from '../hooks/useSignalEngine';
import { cn } from '../lib/utils';

interface SignalCardProps {
  signal: Signal | null;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  if (!signal) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-dashed border-border rounded-xl bg-card/50 text-muted-foreground p-8 text-center">
        <div className="w-12 h-12 mb-4 rounded-full bg-muted flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Market Scan in Progress</h3>
        <p className="max-w-[240px] mt-2 text-sm">
          Waiting for all 7 technical conditions to align. Trend must be strong and confirmed by RSI/MACD.
        </p>
      </div>
    );
  }

  const isBuy = signal.type === 'BUY';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={signal.type + signal.entry}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 p-6 h-full",
          isBuy ? "bg-emerald-500/5 border-emerald-500/30" : "bg-rose-500/5 border-rose-500/30"
        )}
      >
        <div className={cn(
          "absolute -top-24 -right-24 w-48 h-48 blur-[100px] opacity-20 rounded-full",
          isBuy ? "bg-emerald-500" : "bg-rose-500"
        )} />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
              isBuy ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            )}>
              {isBuy ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
            </div>
            <div>
              <h3 className={cn(
                "text-2xl font-black uppercase tracking-tighter leading-none",
                isBuy ? "text-emerald-500" : "text-rose-500"
              )}>
                {isBuy ? 'Buy Now' : 'Sell Now'}
              </h3>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mt-1">
                Market Confirmation
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Confidence</div>
            <div className={cn(
              "text-3xl font-black tabular-nums",
              signal.confidence > 90 ? "text-primary" : "text-foreground"
            )}>
              {signal.confidence.toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-background rounded-lg border border-border">
            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Entry</div>
            <div className="text-lg font-bold tabular-nums">{signal.entry.toFixed(5)}</div>
          </div>
          <div className="p-3 bg-background rounded-lg border border-border">
            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Stop Loss</div>
            <div className="text-lg font-bold tabular-nums text-rose-500">{signal.sl.toFixed(5)}</div>
          </div>
          <div className="p-3 bg-background rounded-lg border border-border">
            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Take Profit 1</div>
            <div className="text-lg font-bold tabular-nums text-emerald-500">{signal.tp1.toFixed(5)}</div>
          </div>
          <div className="p-3 bg-background rounded-lg border border-border">
            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Take Profit 2</div>
            <div className="text-lg font-bold tabular-nums text-emerald-500">{signal.tp2.toFixed(5)}</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} /> Confirmation Matrix
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {signal.reason.map((reason, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80 bg-background/50 p-2 rounded border border-border/50">
                <CheckCircle2 size={14} className={isBuy ? "text-emerald-500" : "text-rose-500"} />
                {reason}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase">R/R Ratio: 1:2.0</span>
          </div>
          <div className="px-2 py-1 rounded bg-muted text-[10px] font-bold text-muted-foreground uppercase">
            AI Scoring Engine
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
