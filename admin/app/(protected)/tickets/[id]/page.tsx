'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ticketsService } from '@/services/tickets.service';
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

      <Card title="Description" className="mt-6 max-w-3xl">
        <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
          {ticket.description}
        </p>
        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <p className="text-sm text-slate-500">
            Messages are handled in the Chat section.
          </p>
          <Link
            href={`/chat/${ticket.id}`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Open conversation →
          </Link>
        </div>
      </Card>
    </div>
  );
}
