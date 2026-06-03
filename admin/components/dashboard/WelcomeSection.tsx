interface WelcomeSectionProps {
  name: string;
}

export function WelcomeSection({ name }: WelcomeSectionProps) {
  const greeting = getGreeting();
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-900 to-violet-950/40 p-6 sm:p-8">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-300/90">{greeting}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome back, {name}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
            Here&apos;s what&apos;s happening across your support platform today.
          </p>
        </div>
        <div className="shrink-0 rounded-xl border border-zinc-700/60 bg-zinc-800/50 px-4 py-3 text-right backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Today
          </p>
          <p className="mt-0.5 text-sm font-medium text-zinc-200">{today}</p>
        </div>
      </div>
    </section>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
