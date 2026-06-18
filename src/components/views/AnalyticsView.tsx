import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Percent, Target, Clock, Award, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AnalyticsView: React.FC = () => {
  // Simulated analytics data
  const stats = {
    totalTrades: 156,
    winRate: 87.5,
    profitFactor: 2.4,
    avgRR: 2.1,
    maxDrawdown: 4.2,
    sharpeRatio: 1.8,
    bestTrade: 450,
    worstTrade: -120,
    avgHoldTime: '2.4h',
    consecutiveWins: 8,
    consecutiveLosses: 2,
  };

  const pairPerformance = [
    { pair: 'EURUSD', trades: 52, winRate: 89, pnl: 2450 },
    { pair: 'GBPUSD', trades: 38, winRate: 84, pnl: 1820 },
    { pair: 'USDJPY', trades: 34, winRate: 91, pnl: 3120 },
    { pair: 'AUDUSD', trades: 18, winRate: 83, pnl: 890 },
    { pair: 'USDCAD', trades: 14, winRate: 86, pnl: 1240 },
  ];

  const sessionPerformance = [
    { session: 'London', trades: 68, winRate: 89, pnl: 4200 },
    { session: 'New York', trades: 52, winRate: 86, pnl: 3100 },
    { session: 'London/NY', trades: 24, winRate: 92, pnl: 1800 },
    { session: 'Tokyo', trades: 8, winRate: 75, pnl: 420 },
    { session: 'Sydney', trades: 4, winRate: 75, pnl: 180 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Award className="text-emerald-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Win Rate</span>
          </div>
          <div className="text-3xl font-black tabular-nums text-emerald-500">{stats.winRate}%</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">{stats.totalTrades} Trades</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-blue-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Profit Factor</span>
          </div>
          <div className="text-3xl font-black tabular-nums">{stats.profitFactor}</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Risk/Reward</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="text-amber-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total P&L</span>
          </div>
          <div className="text-3xl font-black tabular-nums text-emerald-500">+$9,700</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">All Time</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-purple-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sharpe Ratio</span>
          </div>
          <div className="text-3xl font-black tabular-nums">{stats.sharpeRatio}</div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Risk Adjusted</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={16} /> Trade Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Best Trade</span>
              <span className="text-sm font-black text-emerald-500">+${stats.bestTrade}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Worst Trade</span>
              <span className="text-sm font-black text-rose-500">${stats.worstTrade}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Avg R/R Ratio</span>
              <span className="text-sm font-black">1:{stats.avgRR}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Max Drawdown</span>
              <span className="text-sm font-black text-rose-500">{stats.maxDrawdown}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Avg Hold Time</span>
              <span className="text-sm font-black">{stats.avgHoldTime}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={16} /> Streaks
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Current Streak</span>
              <span className="text-sm font-black text-emerald-500">5 Wins</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Best Win Streak</span>
              <span className="text-sm font-black text-emerald-500">{stats.consecutiveWins} Wins</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Worst Loss Streak</span>
              <span className="text-sm font-black text-rose-500">{stats.consecutiveLosses} Losses</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Profit Factor</span>
              <span className="text-sm font-black">{stats.profitFactor}x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Expectancy</span>
              <span className="text-sm font-black text-emerald-500">+$62.18</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Clock size={16} /> Performance by Session
          </h3>
          <div className="space-y-3">
            {sessionPerformance.map((session) => (
              <div key={session.session} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold">{session.session}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">{session.trades} trades</span>
                  <span className="text-xs font-black text-emerald-500">{session.winRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pair Performance */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <BarChart3 size={16} /> Performance by Pair
        </h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pair</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trades</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Win Rate</th>
                <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total P&L</th>
              </tr>
            </thead>
            <tbody>
              {pairPerformance.map((pair) => (
                <tr key={pair.pair} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-bold">{pair.pair}</td>
                  <td className="px-4 py-3 text-sm tabular-nums">{pair.trades}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[100px]">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${pair.winRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-black tabular-nums">{pair.winRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-black text-emerald-500 tabular-nums">+${pair.pnl}</span>
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
