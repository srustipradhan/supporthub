'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V8.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: '/tickets',
    label: 'Tickets',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18.75a1.125 1.125 0 01-1.125 1.125H6.75a1.125 1.125 0 01-1.125-1.125V7.125c0-.621.504-1.125 1.125-1.125h3.375a9.375 9.375 0 009 9z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-900/50 md:flex">
      <div className="border-b border-zinc-800/80 px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white">
            S
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white">
              SupportHub
            </h1>
            <p className="text-xs text-zinc-500">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-violet-600/15 text-violet-300 ring-1 ring-inset ring-violet-500/30'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800/80 p-4">
        <div className="rounded-xl bg-zinc-800/40 px-3 py-3">
          <p className="truncate text-sm font-medium text-zinc-200">
            {user?.name}
          </p>
          <p className="truncate text-xs text-zinc-500">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          onClick={logout}
        >
          Sign out
        </Button>
      </div>
    </aside>
  );
}
