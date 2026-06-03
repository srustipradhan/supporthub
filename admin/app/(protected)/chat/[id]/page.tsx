'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ticketsService } from '@/services/tickets.service';
import { TicketChat } from '@/components/tickets/TicketChat';
import { StatusBadge } from '@/components/ui/Badge';
import type { Ticket } from '@/types';

export default function ChatDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTicket = useCallback(async () => {
    try {
      const data = await ticketsService.getById(id);
      setTicket(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!ticket) {
    return <p className="text-red-600">Conversation not found</p>;
  }

  return (
    <div>
      <Link
        href="/chat"
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Back to chat
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {ticket.title}
        </h1>
        <StatusBadge status={ticket.status} />
      </div>
      <p className="mt-2 text-slate-500">
        With {ticket.user?.name} ({ticket.user?.email}) ·{' '}
        <Link
          href={`/tickets/${ticket.id}`}
          className="text-indigo-600 hover:underline"
        >
          View ticket details
        </Link>
      </p>

      <div className="mt-6">
        <TicketChat
          ticketId={ticket.id}
          status={ticket.status}
          initialMessages={ticket.messages}
        />
      </div>
    </div>
  );
}
