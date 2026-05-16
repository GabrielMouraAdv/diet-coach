'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

const NO_SHELL = ['/login', '/admin/login', '/convite', '/admin', '/admin/cliente'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noShell = NO_SHELL.some(p => pathname.startsWith(p));

  if (noShell) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-60 min-h-screen bg-[hsl(var(--bg))]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
