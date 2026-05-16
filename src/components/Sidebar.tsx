'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Pill,
  TrendingUp,
  FlaskConical,
  User,
  Dumbbell,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/',              label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/coach',         label: 'Coach IA',     icon: Menu },        // Bot icon placeholder
  { href: '/diario',        label: 'Diário',       icon: UtensilsCrossed },
  { href: '/medicamentos',  label: 'Medicamentos', icon: Pill },
  { href: '/evolucao',      label: 'Evolução',     icon: TrendingUp },
  { href: '/exames',        label: 'Exames',       icon: FlaskConical },
  { href: '/treino',        label: 'Treino',       icon: Dumbbell },
  { href: '/perfil',        label: 'Perfil',       icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${active
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-ink-600 hover:bg-ink-100'
              }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center h-14 px-4 bg-white border-b shadow-sm">
        <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-ink-100">
          <Menu size={20} />
        </button>
        <span className="ml-3 font-semibold text-brand-700">🥗 Diet Coach</span>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-60 bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b">
              <span className="font-semibold text-brand-700">🥗 Diet Coach</span>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-ink-100">
                <X size={18} />
              </button>
            </div>
            <NavLinks />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 fixed left-0 top-0 h-full bg-white border-r shadow-sm z-30">
        <div className="flex items-center gap-2 px-5 h-16 border-b">
          <span className="text-xl">🥗</span>
          <div>
            <p className="font-semibold text-brand-700 leading-tight">Diet Coach</p>
            <p className="text-xs text-ink-400">Seu coach de bem-estar</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="p-4 border-t space-y-2">
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="w-full text-xs text-ink-400 hover:text-red-500 transition-colors py-1">
              Sair da conta
            </button>
          </form>
          <p className="text-xs text-ink-400 text-center">
            Não substitui orientação médica.
          </p>
        </div>
      </aside>

      {/* Spacer mobile */}
      <div className="md:hidden h-14" />
    </>
  );
}
