'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ticketsService } from '@/services/tickets.service';
import { TicketChat } from '@/components/tickets/TicketChat';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Ticket } from '@/types';

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleClose = async () => {
    setActionLoading(true);
    try {
      const updated = await ticketsService.close(id);
      setTicket(updated);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReopen = async () => {
    setActionLoading(true);
    try {
      const updated = await ticketsService.reopen(id);
      setTicket(updated);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!ticket) {
    return <p className="text-red-600">Ticket not found</p>;
  }

  return (
    <div>
      <Link
        href="/tickets"
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Back to tickets
      </Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {ticket.title}
            </h1>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="mt-2 text-slate-500">
            By {ticket.user?.name} ({ticket.user?.email}) ·{' '}
            {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {ticket.status === 'OPEN' ? (
            <Button
              variant="danger"
              onClick={handleClose}
              isLoading={actionLoading}
            >
              Close Ticket
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={handleReopen}
              isLoading={actionLoading}
            >
              Reopen Ticket
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Description" className="lg:col-span-1">
          <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </Card>
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            Conversation
          </h2>
          <TicketChat
            ticketId={ticket.id}
            status={ticket.status}
            initialMessages={ticket.messages}
          />
        </div>
      </div>
    </div>
  );
}
