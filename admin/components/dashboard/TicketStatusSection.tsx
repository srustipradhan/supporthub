interface TicketStatusSectionProps {
  openTickets: number;
  closedTickets: number;
  totalTickets: number;
}

export function TicketStatusSection({
  openTickets,
  closedTickets,
  totalTickets,
}: TicketStatusSectionProps) {
  const openPercent =
    totalTickets > 0 ? Math.round((openTickets / totalTickets) * 100) : 0;
  const closedPercent =
    totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0;

  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white">Ticket Status</h2>
      <p className="mt-0.5 text-sm text-zinc-500">Open vs closed breakdown</p>

      <div className="mt-6 space-y-6">
        <ProgressRow
          label="Open"
          count={openTickets}
          percent={openPercent}
          barClass="bg-emerald-500"
          dotClass="bg-emerald-400"
        />
        <ProgressRow
          label="Closed"
          count={closedTickets}
          percent={closedPercent}
          barClass="bg-zinc-500"
          dotClass="bg-zinc-400"
        />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-4 py-3">
        <span className="text-sm text-zinc-400">Total volume</span>
        <span className="text-lg font-semibold tabular-nums text-white">
          {totalTickets}
        </span>
      </div>
    </section>
  );
}

function ProgressRow({
  label,
  count,
  percent,
  barClass,
  dotClass,
}: {
  label: string;
  count: number;
  percent: number;
  barClass: string;
  dotClass: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          <span className="text-sm font-medium text-zinc-300">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold tabular-nums text-white">
            {count}
          </span>
          <span className="ml-2 text-xs text-zinc-500">{percent}%</span>
        </div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
