'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import {
  StatCard,
  UsersIcon,
  TicketsIcon,
  OpenIcon,
  ClosedIcon,
} from '@/components/dashboard/StatCard';
import { RecentTicketsTable } from '@/components/dashboard/RecentTicketsTable';
import { TicketStatusSection } from '@/components/dashboard/TicketStatusSection';
import { RecentActivityPanel } from '@/components/dashboard/RecentActivityPanel';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { dashboardService } from '@/services/dashboard.service';
import { ticketsService } from '@/services/tickets.service';
import type { DashboardStats, Ticket } from '@/types';

const RECENT_TICKETS_LIMIT = 8;

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([dashboardService.getStats(), ticketsService.getAll()])
      .then(([statsData, ticketsData]) => {
        setStats(statsData);
        setTickets(ticketsData);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard',
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-6 text-center">
        <p className="text-sm font-medium text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 text-sm font-medium text-violet-400 hover:text-violet-300"
        >
          Try again
        </button>
      </div>
    );
  }

  const recentTickets = tickets.slice(0, RECENT_TICKETS_LIMIT);
  const displayName = user?.name?.split(' ')[0] ?? 'Admin';

  return (
    <div className="space-y-6">
      <WelcomeSection name={displayName} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={<UsersIcon />}
          accent="violet"
          trendLabel="Registered accounts"
        />
        <StatCard
          title="Total Tickets"
          value={stats?.totalTickets ?? 0}
          icon={<TicketsIcon />}
          accent="blue"
          trendLabel="All time volume"
        />
        <StatCard
          title="Open Tickets"
          value={stats?.openTickets ?? 0}
          icon={<OpenIcon />}
          accent="emerald"
          trendLabel="Awaiting response"
        />
        <StatCard
          title="Closed Tickets"
          value={stats?.closedTickets ?? 0}
          icon={<ClosedIcon />}
          accent="zinc"
          trendLabel="Resolved requests"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTicketsTable tickets={recentTickets} />
        </div>
        <div className="flex flex-col gap-6">
          <TicketStatusSection
            openTickets={stats?.openTickets ?? 0}
            closedTickets={stats?.closedTickets ?? 0}
            totalTickets={stats?.totalTickets ?? 0}
          />
          <RecentActivityPanel tickets={tickets} />
        </div>
      </div>
    </div>
  );
}
