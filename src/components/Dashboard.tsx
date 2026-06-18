import React from 'react';
import { useSignalEngine } from '../hooks/useSignalEngine';
import { TradingChart } from './TradingChart';
import { SignalCard } from './SignalCard';
import { RiskCalculator } from './RiskCalculator';
import { SessionClock } from './SessionClock';
import { NewsFilter } from './NewsFilter';
import { 
  LayoutDashboard, 
  Settings, 
  History, 
  BarChart3, 
  Zap, 
  Activity,
  Gauge,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Toaster, toast } from 'sonner';

export const Dashboard: React.FC = () => {
  const { data, currentSignal, indicators, smc } = useSignalEngine();

  // Force dark mode
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Alert when signal changes
  React.useEffect(() => {
    if (currentSignal) {
      toast[currentSignal.type === 'BUY' ? 'success' : 'error'](
        `${currentSignal.type} SIGNAL DETECTED!`,
        { description: `${currentSignal.type} @ ${currentSignal.entry.toFixed(5)}` }
      );
    }
  }, [currentSignal?.type, currentSignal?.entry]);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans antialiased text-foreground">
      <Toaster position="top-right" theme="dark" richColors />
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/c5119054-ff3e-4690-be33-8972c0f56bda/logo-webp-b4e14965-1781815381786.webp" 
            alt="MT5 AI Logo" 
            className="w-10 h-10 rounded-lg object-cover border border-primary/20 shadow-lg shadow-primary/10"
          />
          <span className="font-black text-xl tracking-tighter uppercase italic">MT5<span className="text-primary">AI</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Terminal" active />
          <SidebarItem icon={<Activity size={18} />} label="Live Signals" />
          <SidebarItem icon={<Layers size={18} />} label="SMC Analysis" />
          <SidebarItem icon={<History size={18} />} label="History" />
          <SidebarItem icon={<BarChart3 size={18} />} label="Analytics" />
        </nav>

        <div className="p-4 border-t border-border">
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#050505]">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Pair:</span>
              <span className="text-sm font-black tabular-nums">EURUSD</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">LIVE</span>
            </div>
          </div>

          <SessionClock />
        </header>

        <div className="p-8 space-y-8">
          {/* Top Row: Indicators & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
              label="Trend Detection" 
              value={indicators.trend} 
              subValue={`${indicators.trendStrength.toFixed(0)}% Intensity`}
              icon={<Gauge className="text-primary" />}
              status={indicators.trend === 'Bullish' ? 'success' : 'error'}
            />
            <StatCard 
              label="RSI (14)" 
              value={indicators.rsi.toFixed(1)} 
              subValue={indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
              icon={<Activity className="text-blue-500" />}
            />
            <StatCard 
              label="Volatility" 
              value="0.0015" 
              subValue="Low Range"
              icon={<BarChart3 className="text-amber-500" />}
            />
            <StatCard 
              label="AI Engine" 
              value="Active" 
              subValue="95% Precision"
              icon={<Zap className="text-emerald-500" />}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Chart Area */}
            <div className="xl:col-span-8 space-y-6">
              <TradingChart data={data} indicators={indicators} smc={smc} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                      <Layers size={16} /> MTF Analysis
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                       {['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1'].map(tf => (
                         <div key={tf} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-muted-foreground">{tf}</span>
                            <div className={cn(
                              "w-full h-2 rounded-full",
                              indicators.trend === 'Bullish' ? "bg-emerald-500" : "bg-rose-500"
                            )} />
                         </div>
                       ))}
                    </div>
                 </div>

                 <NewsFilter />
              </div>
            </div>

            {/* Signal & Actions */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              <SignalCard signal={currentSignal} />
              <RiskCalculator currentSignal={currentSignal} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <div className={cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group",
    active ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-muted text-muted-foreground hover:text-foreground"
  )}>
    {icon}
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </div>
);

const StatCard = ({ label, value, subValue, icon, status }: { label: string, value: string, subValue: string, icon: React.ReactNode, status?: 'success' | 'error' }) => (
  <div className="p-5 rounded-xl border border-border bg-card">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-background border border-border">
        {icon}
      </div>
      <div className={cn(
        "px-2 py-0.5 rounded text-[10px] font-black uppercase",
        status === 'success' ? "bg-emerald-500/10 text-emerald-500" : status === 'error' ? "bg-rose-500/10 text-rose-500" : "bg-muted text-muted-foreground"
      )}>
        LIVE
      </div>
    </div>
    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</h3>
    <div className="text-2xl font-black tabular-nums">{value}</div>
    <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">{subValue}</div>
  </div>
);
