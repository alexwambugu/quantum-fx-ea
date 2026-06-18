import React from 'react';
import { History, TrendingUp, TrendingDown, Calendar, DollarSign, Percent, Award } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TradeRecord {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  exit: number;
  sl: number;
  tp: number;
  lots: number;
  pnl: number;
  pips: number;
  date: string;
  duration: string;
  status: 'win' | 'loss';
}

const tradeHistory: TradeRecord[] = [
  { id: '1', pair: 'EURUSD', type: 'BUY', entry: 1.1045, exit: 1.1078, sl: 1.1015, tp: 1.1085, lots: 0.5, pnl: 165, pips: 33, date: '2024-01-15', duration: '2h 15m', status: 'win' },
  { id: '2', pair: 'GBPUSD', type: 'SELL', entry: 1.2682, exit: 1.2645, sl: 1.2712, tp: 1.2640, lots: 0.3, pnl: 111, pips: 37, date: '2024-01-15', duration: '1h 45m', status: 'win' },
  { id: '3', pair: 'EURUSD', type: 'BUY', entry: 1.1012, exit: 1.0998, sl: 1.0982, tp: 1.1052, lots: 0.5, pnl: -70, pips: -14, date: '2024-01-14', duration: '45m', status: 'loss' },
  { id: '4', pair: 'USDJPY', type: 'SELL', entry: 148.98, exit: 148.31, sl: 149.28, tp: 148.20, lots: 0.4, pnl: 268, pips: 67, date: '2024-01-14', duration: '3h 20m', status: 'win' },
  { id: '5', pair: 'EURUSD', type: 'BUY', entry: 1.0985, exit: 1.1019, sl: 1.0955, tp: 1.1025, lots: 0.5, pnl: 170, pips: 34, date: '2024-01-13', duration: '1h 30m', status: 'win' },
  { id: '6', pair: 'GBPUSD', type: 'BUY', entry: 1.2645, exit: 1.2612, sl: 1.2615, tp: 1.2685, lots: 0.3, pnl: -99, pips: -33, date: '2024-01-13', duration: '2h', status: 'loss' },
  { id: '7', pair: 'EURUSD', type: 'SELL', entry: 1.1098, exit: 1.1031, sl: 1.1128, tp: 1.1020, lots: 0.5, pnl: 335, pips: 67, date: '2024-01-12', duration: '4h 10m', status: 'win' },
  { id: '8', pair: 'USDJPY', type: 'BUY', entry: 147.85, exit: 148.22, sl: 147.55, tp: 148.35, lots: 0.4, pnl: 148, pips: 37, date: '2024-01-12', duration: '2h 45m', status: 'win' },
];

export const HistoryView: React.FC = () => {
  const totalPnl = tradeHistory.reduce((sum, t) => sum + t.pnl, 0);
  const totalPips = tradeHistory.reduce((sum, t) => sum + t.pips, 0);
  const wins = tradeHistory.filter(t => t.status === 'win').length;
  const winRate = (wins / tradeHistory.length) * 100;

  return (
    <div className="p-8 space-y-8">
      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="text-emerald-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total P&L</span>
          </div>
          <div className={cn("text-3xl font-black tabular-nums", totalPnl > 0 ? "text-emerald-500" : "text-rose-500")}>
            ${totalPnl > 0 ? '+' : ''}{totalPnl}
          </div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">All Time</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-blue-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Pips</span>
          </div>
          <div className={cn("text-3xl font-black tabular-nums", totalPips > 0 ? "text-emerald-500" : "text-rose-500")}>
            {totalPips > 0 ? '+' : ''}{totalPips}
          </div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Net Gain</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="text-amber-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Win Rate</span>
          </div>
          <div className="text-3xl font-black tabular-nums">{winRate.toFixed(1)}%</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">{wins}W / {tradeHistory.length - wins}L</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Award className="text-purple-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Trades</span>
          </div>
          <div className="text-3xl font-black tabular-nums">{tradeHistory.length}</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Executed</div>
        </div>
      </div>

      {/* Trade History Table */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <History size={16} /> Trade Journal
        </h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pair</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entry</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Exit</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lots</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration</th>
                <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pips</th>
                <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">P&L</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.map((trade) => (
                <tr key={trade.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{trade.date}</td>
                  <td className="px-4 py-3 text-xs font-bold">{trade.pair}</td>
                  <td className="px-4 py-3">
                    <div className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-md w-fit",
                      trade.type === 'BUY' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {trade.type === 'BUY' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      <span className="text-[10px] font-black uppercase">{trade.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold tabular-nums">{trade.entry.toFixed(trade.pair.includes('JPY') ? 3 : 5)}</td>
                  <td className="px-4 py-3 text-xs font-bold tabular-nums">{trade.exit.toFixed(trade.pair.includes('JPY') ? 3 : 5)}</td>
                  <td className="px-4 py-3 text-xs tabular-nums">{trade.lots.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{trade.duration}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn(
                      "text-xs font-black tabular-nums",
                      trade.pips > 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {trade.pips > 0 ? '+' : ''}{trade.pips}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn(
                      "text-xs font-black tabular-nums",
                      trade.pnl > 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {trade.pnl > 0 ? '+' : ''}${trade.pnl}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
