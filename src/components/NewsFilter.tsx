import React, { useState, useEffect } from 'react';
import { CalendarDays, AlertOctagon, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface NewsEvent {
  time: string;
  impact: 'High' | 'Medium' | 'Low';
  title: string;
  currency: string;
  isBlocked: boolean;
}

const BLOCKED_KEYWORDS = ['NFP', 'CPI', 'FOMC', 'Interest Rate', 'Non-Farm', 'Fed'];

const generateNewsEvents = (): NewsEvent[] => {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const currentMin = now.getUTCMinutes();
  const nowMinutes = currentHour * 60 + currentMin;

  const events: NewsEvent[] = [
    { time: '08:30', impact: 'High', title: 'USD Non-Farm Payrolls', currency: 'USD', isBlocked: false },
    { time: '10:00', impact: 'Medium', title: 'EUR Flash Services PMI', currency: 'EUR', isBlocked: false },
    { time: '13:30', impact: 'High', title: 'USD CPI m/m', currency: 'USD', isBlocked: false },
    { time: '14:00', impact: 'High', title: 'FOMC Statement', currency: 'USD', isBlocked: false },
    { time: '15:00', impact: 'Medium', title: 'GBP Manufacturing PMI', currency: 'GBP', isBlocked: false },
    { time: '19:00', impact: 'Low', title: 'CAD GDP m/m', currency: 'CAD', isBlocked: false },
  ];

  events.forEach(event => {
    const [h, m] = event.time.split(':').map(Number);
    const eventMinutes = h * 60 + m;
    const diff = Math.abs(eventMinutes - nowMinutes);

    if (event.impact === 'High' && diff <= 30) {
      event.isBlocked = true;
    }
    if (BLOCKED_KEYWORDS.some(kw => event.title.includes(kw)) && diff <= 30) {
      event.isBlocked = true;
    }
  });

  return events;
};

export const NewsFilter: React.FC = () => {
  const [events, setEvents] = useState<NewsEvent[]>(generateNewsEvents());
  const [isTradingBlocked, setIsTradingBlocked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = generateNewsEvents();
      setEvents(updated);
      setIsTradingBlocked(updated.some(e => e.isBlocked));
    }, 60000);

    setIsTradingBlocked(events.some(e => e.isBlocked));
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <CalendarDays size={16} /> Economic Calendar
        </h3>
        {isTradingBlocked ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
            <AlertOctagon size={12} className="text-rose-500" />
            <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Trade Blocked</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Safe to Trade</span>
          </div>
        )}
      </div>

      {isTradingBlocked && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 flex items-start gap-2">
          <AlertOctagon size={14} className="text-rose-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-rose-400">High-Impact News Detected</p>
            <p className="text-[10px] text-rose-400/70 mt-0.5">Trading blocked 30 min before/after major events (NFP, CPI, FOMC, Rate Decisions)</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {events.map((event, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all",
              event.isBlocked
                ? "bg-rose-500/5 border-rose-500/20"
                : "bg-background border-border/50"
            )}
          >
            <div className="flex items-center gap-1.5 w-14 shrink-0">
              <Clock size={10} className="text-muted-foreground" />
              <span className="text-xs font-bold tabular-nums text-muted-foreground">{event.time}</span>
            </div>
            <div className={cn(
              "px-1.5 py-0.5 rounded-[2px] text-[8px] font-black uppercase shrink-0",
              event.impact === 'High' ? "bg-rose-500/10 text-rose-500" : event.impact === 'Medium' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
            )}>
              {event.impact}
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-xs font-bold truncate",
                event.isBlocked ? "text-rose-400" : "text-foreground"
              )}>
                {event.title}
              </div>
            </div>
            <div className="text-[10px] font-black text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
              {event.currency}
            </div>
            {event.isBlocked && (
              <AlertOctagon size={12} className="text-rose-500 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
