import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  accent: 'violet' | 'blue' | 'emerald' | 'zinc';
  trendLabel?: string;
}

const accentStyles = {
  violet: {
    ring: 'ring-violet-500/20',
    iconBg: 'bg-violet-500/15 text-violet-400',
    glow: 'from-violet-500/5',
  },
  blue: {
    ring: 'ring-blue-500/20',
    iconBg: 'bg-blue-500/15 text-blue-400',
    glow: 'from-blue-500/5',
  },
  emerald: {
    ring: 'ring-emerald-500/20',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    glow: 'from-emerald-500/5',
  },
  zinc: {
    ring: 'ring-zinc-500/20',
    iconBg: 'bg-zinc-500/15 text-zinc-400',
    glow: 'from-zinc-500/5',
  },
};

export function StatCard({
  title,
  value,
  icon,
  accent,
  trendLabel,
}: StatCardProps) {
  const styles = accentStyles[accent];

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 ring-1 ring-inset transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg hover:shadow-black/20 ${styles.ring}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.glow} to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white tabular-nums">
            {value.toLocaleString()}
          </p>
          {trendLabel && (
            <p className="mt-2 text-xs text-zinc-500">{trendLabel}</p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.iconBg}`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}

export function UsersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

export function TicketsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18.75a1.125 1.125 0 01-1.125 1.125H6.75a1.125 1.125 0 01-1.125-1.125V7.125c0-.621.504-1.125 1.125-1.125h3.375a9.375 9.375 0 009 9z" />
    </svg>
  );
}

export function OpenIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839-7.51l-4.66-2.51a2.25 2.25 0 00-2.278 0l-4.66 2.51m0 0l-4.66 2.51a2.25 2.25 0 00-2.278 0l-4.66-2.51" />
    </svg>
  );
}

export function ClosedIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
