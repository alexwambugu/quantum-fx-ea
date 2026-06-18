import React from 'react';
import { useSignalEngine } from '../../hooks/useSignalEngine';
import { TradingChart } from '../TradingChart';
import { Layers, Box, ArrowRightLeft, ArrowUpRight, ArrowDownRight, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SMCAnalysisView: React.FC = () => {
  const { data, indicators, smc } = useSignalEngine();

  const smcStats = {
    orderBlocks: smc.orderBlocks.length,
    fvgs: smc.fvgs.length,
    bos: smc.bos.length,
    choch: smc.choch.length,
  };

  return (
    <div className="p-8 space-y-8">
      {/* SMC Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Box className="text-cyan-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Blocks</span>
          </div>
          <div className="text-3xl font-black tabular-nums">{smcStats.orderBlocks}</div>
          <div className="text-[10px] font-bold text-cyan-500 mt-1 uppercase">Detected</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRightLeft className="text-purple-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fair Value Gaps</span>
          </div>
          <div className="text-3xl font-black tabular-nums">{smcStats.fvgs}</div>
          <div className="text-[10px] font-bold text-purple-500 mt-1 uppercase">Unfilled</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpRight className="text-emerald-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Break of Structure</span>
          </div>
          <div className="text-3xl font-black tabular-nums">{smcStats.bos}</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Last 24h</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <ArrowDownRight className="text-amber-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Change of Character</span>
          </div>
          <div className="text-3xl font-black tabular-nums">{smcStats.choch}</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Reversals</div>
        </div>
      </div>

      {/* Chart with SMC Overlays */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Layers size={16} /> Price Action with SMC Markers
        </h3>
        <TradingChart data={data} indicators={indicators} smc={smc} />
      </div>

      {/* SMC Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Blocks */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Box size={16} /> Order Blocks
          </h3>
          <div className="space-y-3">
            {smc.orderBlocks.length > 0 ? (
              smc.orderBlocks.map((ob, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                  <div className="flex items-center gap-2">
                    {ob.type === 'bullish' ? (
                      <TrendingUp size={14} className="text-emerald-500" />
                    ) : (
                      <TrendingDown size={14} className="text-rose-500" />
                    )}
                    <span className="text-xs font-bold uppercase">{ob.type} OB</span>
                  </div>
                  <span className="text-xs font-bold tabular-nums">{ob.price.toFixed(5)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Box size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs">No order blocks detected yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Fair Value Gaps */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <ArrowRightLeft size={16} /> Fair Value Gaps
          </h3>
          <div className="space-y-3">
            {smc.fvgs.length > 0 ? (
              smc.fvgs.map((fvg, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-purple-500" />
                    <span className="text-xs font-bold">FVG Zone</span>
                  </div>
                  <div className="text-xs font-bold tabular-nums text-muted-foreground">
                    {fvg.bottom.toFixed(5)} - {fvg.top.toFixed(5)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ArrowRightLeft size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs">No fair value gaps detected yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
