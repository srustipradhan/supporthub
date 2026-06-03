export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-28 rounded-2xl bg-zinc-800/60" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-zinc-800/60" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-96 rounded-2xl bg-zinc-800/60 lg:col-span-2" />
        <div className="space-y-6">
          <div className="h-44 rounded-2xl bg-zinc-800/60" />
          <div className="h-72 rounded-2xl bg-zinc-800/60" />
        </div>
      </div>
    </div>
  );
}
