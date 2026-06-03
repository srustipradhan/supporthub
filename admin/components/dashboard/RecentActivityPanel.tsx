import Link from 'next/link';
import { formatRelativeTime } from '@/lib/format';
import type { Ticket } from '@/types';

interface RecentActivityPanelProps {
  tickets: Ticket[];
}

interface ActivityItem {
  id: string;
  ticketId: string;
  title: string;
  type: 'opened' | 'closed';
  timestamp: string;
}

export function RecentActivityPanel({ tickets }: RecentActivityPanelProps) {
  const activities = buildActivity(tickets);

  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white">Recent Activity</h2>
      <p className="mt-0.5 text-sm text-zinc-500">Latest ticket events</p>

      <ul className="mt-5 space-y-1">
        {activities.length === 0 ? (
          <li className="rounded-xl border border-dashed border-zinc-800 py-8 text-center text-sm text-zinc-500">
            No recent activity
          </li>
        ) : (
          activities.map((item) => (
            <li key={item.id}>
              <Link
                href={`/tickets/${item.ticketId}`}
                className="group flex gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-zinc-800/50"
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    item.type === 'opened'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-zinc-500/15 text-zinc-400'
                  }`}
                >
                  {item.type === 'opened' ? (
                    <InboxIcon />
                  ) : (
                    <CheckIcon />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-300">
                    <span className="font-medium text-zinc-200 group-hover:text-violet-300">
                      {item.title}
                    </span>
                    <span className="text-zinc-500">
                      {' '}
                      {item.type === 'opened'
                        ? 'was opened'
                        : 'was closed'}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {formatRelativeTime(item.timestamp)}
                  </p>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function buildActivity(tickets: Ticket[]): ActivityItem[] {
  return tickets.slice(0, 8).map((ticket) => ({
    id: ticket.id,
    ticketId: ticket.id,
    title: ticket.title,
    type: ticket.status === 'OPEN' ? 'opened' : 'closed',
    timestamp: ticket.createdAt,
  }));
}

function InboxIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
