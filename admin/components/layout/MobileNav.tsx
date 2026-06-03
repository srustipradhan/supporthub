'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/chat', label: 'Chat' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white">
            S
          </div>
          <span className="text-sm font-semibold text-white">SupportHub</span>
        </div>
        <nav className="flex gap-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-violet-600/15 text-violet-300'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
