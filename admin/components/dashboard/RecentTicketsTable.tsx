import Link from 'next/link';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, shortTicketId } from '@/lib/format';
import type { Ticket } from '@/types';

interface RecentTicketsTableProps {
  tickets: Ticket[];
}

export function RecentTicketsTable({ tickets }: RecentTicketsTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/80">
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-white">Recent Tickets</h2>
          <p className="mt-0.5 text-sm text-zinc-500">Latest support requests</p>
        </div>
        <Link
          href="/tickets"
          className="text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800/80 bg-zinc-950/40 text-xs font-medium uppercase tracking-wider text-zinc-500">
              <th className="px-5 py-3 sm:px-6">Ticket ID</th>
              <th className="px-5 py-3 sm:px-6">Title</th>
              <th className="px-5 py-3 sm:px-6">Status</th>
              <th className="px-5 py-3 sm:px-6">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {tickets.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-zinc-500"
                >
                  No tickets yet. New requests will appear here.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="group transition-colors hover:bg-zinc-800/40"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-zinc-400 sm:px-6">
                    {shortTicketId(ticket.id)}
                  </td>
                  <td className="max-w-[240px] truncate px-5 py-4 sm:max-w-none sm:px-6">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="font-medium text-zinc-200 transition-colors group-hover:text-violet-300"
                    >
                      {ticket.title}
                    </Link>
                    {ticket.user?.name && (
                      <p className="mt-0.5 truncate text-xs text-zinc-500">
                        {ticket.user.name}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-zinc-400 sm:px-6">
                    {formatDate(ticket.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
