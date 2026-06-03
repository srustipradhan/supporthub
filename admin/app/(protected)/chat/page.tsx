'use client';

import Link from 'next/link';
import { useTickets } from '@/hooks/useTickets';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/Badge';
import type { TicketStatus } from '@/types';

export default function ChatPage() {
  const {
    tickets,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = useTickets();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chat</h1>
      <p className="mt-1 text-slate-500">
        Support conversations — separate from ticket management
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by title, user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as TicketStatus | 'ALL')
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="ALL">All</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      )}

      {error && <p className="mt-8 text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 font-medium">Ticket</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No conversations found
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {ticket.user?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/chat/${ticket.id}`}
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        Open chat →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
