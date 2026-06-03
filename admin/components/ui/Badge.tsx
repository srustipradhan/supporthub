import type { TicketStatus } from '@/types';

interface BadgeProps {
  status: TicketStatus;
}

export function StatusBadge({ status }: BadgeProps) {
  const styles =
    status === 'OPEN'
      ? 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/25'
      : 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/25';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles}`}
    >
      {status}
    </span>
  );
}
