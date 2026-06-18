import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface Session {
  name: string;
  startUTC: number;
  endUTC: number;
  color: string;
}

const SESSIONS: Session[] = [
  { name: 'Sydney', startUTC: 22, endUTC: 7, color: 'text-blue-400' },
  { name: 'Tokyo', startUTC: 0, endUTC: 9, color: 'text-purple-400' },
  { name: 'London', startUTC: 8, endUTC: 17, color: 'text-emerald-400' },
  { name: 'New York', startUTC: 13, endUTC: 22, color: 'text-amber-400' },
];

const isSessionOpen = (session: Session, utcHour: number): boolean => {
  if (session.startUTC < session.endUTC) {
    return utcHour >= session.startUTC && utcHour < session.endUTC;
  }
  // Wraps around midnight (e.g., Sydney 22-7)
  return utcHour >= session.startUTC || utcHour < session.endUTC;
};

const getOverlapStatus = (utcHour: number): string | null => {
  const overlap = utcHour >= 13 && utcHour < 17;
  if (overlap) return 'London/NY Overlap';
  if (utcHour >= 8 && utcHour < 9) return 'London Open';
  if (utcHour >= 13 && utcHour < 14) return 'New York Open';
  return null;
};

export const SessionClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const utcHour = time.getUTCHours();
  const utcMin = time.getUTCMinutes();
  const utcSec = time.getUTCSeconds();
  const overlap = getOverlapStatus(utcHour);

  const formatTime = (h: number, m: number, s: number) =>
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-4">
      {/* Session Badges */}
      <div className="hidden md:flex items-center gap-3">
        {SESSIONS.map(session => {
          const isOpen = isSessionOpen(session, utcHour);
          return (
            <div key={session.name} className="flex items-center gap-1.5">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                isOpen ? "bg-emerald-500 animate-pulse" : "bg-muted"
              )} />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                isOpen ? session.color : "text-muted-foreground"
              )}>
                {session.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Overlap Badge */}
      {overlap && (
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">{overlap}</span>
        </div>
      )}

      {/* UTC Clock */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full border border-border">
        <Clock size={14} className="text-primary" />
        <span className="text-xs font-bold tabular-nums">{formatTime(utcHour, utcMin, utcSec)} UTC</span>
      </div>
    </div>
  );
};
