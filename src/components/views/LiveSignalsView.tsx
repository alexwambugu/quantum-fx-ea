import React from 'react';
import { useSignalEngine } from '../../hooks/useSignalEngine';
import { SignalCard } from '../SignalCard';
import { Activity, TrendingUp, TrendingDown, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LiveSignalsView: React.FC = () => {
  const { currentSignal, indicators } = useSignalEngine();
  const [signalHistory, setSignalHistory] = React.useState<Array<{
    id: string;
    type: 'BUY' | 'SELL';
    entry: number;
    time: string;
    status: 'active' | 'closed';
    pnl?: number;
  }>>([
    { id: '1', type: 'BUY', entry: 1.1045, time: '14:23:15', status: 'active', pnl: 23 },
    { id: '2', type: 'SELL', entry: 1.1082, time: '12:45:30', status: 'closed', pnl: 45 },
    { id: '3', type: 'BUY', entry: 1.1012, time: '10:15:45', status: 'closed', pnl: -12 },
    { id: '4', type: 'SELL', entry: 1.1098, time: '09:30:00', status: 'closed', pnl: 67 },
    { id: '5', type: 'BUY', entry: 1.0985, time: '08:12:22', status: 'closed', pnl: 34 },
  ]);

  return (
    <div className="p-8 space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="text-emerald-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Signals</span>
          </div>
          <div className="text-3xl font-black tabular-nums">{signalHistory.filter(s => s.status === 'active').length}</div>
          <div className="text-[10px] font-bold text-emerald-500 mt-1 uppercase">Live Now</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="text-blue-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Win Rate</span>
          </div>
          <div className="text-3xl font-black tabular-nums">87.5%</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Last 30 Days</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-emerald-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Pips</span>
          </div>
          <div className="text-3xl font-black tabular-nums text-emerald-500">+157</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">This Week</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="text-amber-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avg Hold Time</span>
          </div>
          <div className="text-3xl font-black tabular-nums">2.4h</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Per Trade</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Current Signal */}
        <div className="xl:col-span-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Activity size={16} /> Current Signal
          </h3>
          <SignalCard signal={currentSignal} />
        </div>

        {/* Signal History Table */}
        <div className="xl:col-span-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Clock size={16} /> Signal History
          </h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entry</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pips</th>
                </tr>
              </thead>
              <tbody>
                {signalHistory.map((signal) => (
                  <tr key={signal.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className={cn(
                        "flex items-center gap-2 px-2 py-1 rounded-md w-fit",
                        signal.type === 'BUY' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                      )}>
                        {signal.type === 'BUY' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span className="text-xs font-black uppercase">{signal.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold tabular-nums">{signal.entry.toFixed(5)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">{signal.time}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-black uppercase",
                        signal.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                      )}>
                        {signal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn(
                        "text-sm font-black tabular-nums",
                        (signal.pnl || 0) > 0 ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {(signal.pnl || 0) > 0 ? '+' : ''}{signal.pnl}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
