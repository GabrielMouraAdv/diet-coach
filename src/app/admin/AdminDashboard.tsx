'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Account, Measurement, Invite } from '@prisma/client';
import { createInviteAction, logoutAction } from '@/app/actions/auth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Copy, Check, LogOut, Users, Clock, Link as LinkIcon, ChevronRight } from 'lucide-react';
import NextLink from 'next/link';

type ClientWithRelations = User & {
  account: Pick<Account, 'email' | 'createdAt'>;
  measurements: Measurement[];
};

interface Props {
  clients: ClientWithRelations[];
  pendingInvites: Invite[];
}

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

export function AdminDashboard({ clients, pendingInvites }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newInviteUrl, setNewInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateInvite = () => {
    start(async () => {
      // Pega accountId do admin via rota
      const res = await fetch('/api/admin/account-id');
      const { accountId } = await res.json();
      const invite = await createInviteAction({ adminAccountId: accountId, clientName: inviteName, clientEmail: inviteEmail });
      const url = `${window.location.origin}/convite/${invite.token}`;
      setNewInviteUrl(url);
      setInviteName('');
      setInviteEmail('');
    });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => start(async () => { await logoutAction(); });

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🥗</span>
          <div>
            <p className="font-semibold text-brand-700 leading-tight">Diet Coach</p>
            <p className="text-xs text-ink-400">Painel Admin</p>
          </div>
        </div>
        <button onClick={handleLogout} disabled={pending} className="btn-ghost text-sm flex items-center gap-1.5">
          <LogOut size={15} /> Sair
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
              <Users size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-700">{clients.length}</p>
              <p className="text-xs text-ink-400">Clientes ativos</p>
            </div>
          </div>
          <div className="card flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-700">{pendingInvites.length}</p>
              <p className="text-xs text-ink-400">Convites pendentes</p>
            </div>
          </div>
        </div>

        {/* Gerar convite */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Novo cliente</h2>
            <button onClick={() => setShowInviteForm(v => !v)} className="btn-primary text-sm flex items-center gap-1.5 py-1.5 px-3">
              <Plus size={15} /> Gerar convite
            </button>
          </div>

          {showInviteForm && (
            <div className="space-y-3 border-t pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Nome do cliente</label>
                  <input className="input text-sm" value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="João Silva" />
                </div>
                <div>
                  <label className="label">Email (opcional)</label>
                  <input className="input text-sm" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="joao@email.com" />
                </div>
              </div>
              <button onClick={handleCreateInvite} disabled={pending} className="btn-primary text-sm w-full py-2">
                {pending ? 'Gerando...' : 'Gerar link de convite'}
              </button>

              {newInviteUrl && (
                <div className="rounded-xl bg-brand-50 border border-brand-200 p-3 space-y-2">
                  <p className="text-xs font-semibold text-brand-700 flex items-center gap-1"><LinkIcon size={12} /> Link gerado! Válido por 7 dias.</p>
                  <div className="flex gap-2">
                    <input className="input text-xs flex-1 bg-white" value={newInviteUrl} readOnly />
                    <button onClick={() => copyUrl(newInviteUrl)} className={`btn text-xs px-3 py-2 ${copied ? 'bg-brand-600 text-white' : 'bg-white border'}`}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="text-xs text-ink-400">Envie este link para o cliente via WhatsApp ou email.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Convites pendentes */}
        {pendingInvites.length > 0 && (
          <div className="card">
            <h2 className="font-semibold mb-3">Convites aguardando uso</h2>
            <div className="space-y-2">
              {pendingInvites.map(inv => {
                const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/convite/${inv.token}`;
                return (
                  <div key={inv.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{inv.clientName ?? 'Sem nome'}</p>
                      <p className="text-xs text-ink-400">
                        Expira {format(new Date(inv.expiresAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <button onClick={() => copyUrl(url)} className="btn-ghost text-xs py-1 px-2 flex items-center gap-1">
                      <Copy size={12} /> Copiar link
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista de clientes */}
        <div className="card">
          <h2 className="font-semibold mb-3">Clientes ({clients.length})</h2>
          {clients.length === 0 ? (
            <p className="text-sm text-ink-400 text-center py-6">Nenhum cliente ainda. Gere o primeiro convite acima!</p>
          ) : (
            <div className="space-y-2">
              {clients.map(c => {
                const lastMeasure = c.measurements[0];
                return (
                  <NextLink
                    key={c.id}
                    href={`/admin/cliente/${c.id}`}
                    className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-brand-50/40 -mx-2 px-2 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm group-hover:text-brand-700">{c.name}</p>
                        <p className="text-xs text-ink-400">
                          {c.account.email} · Desde {format(new Date(c.account.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-xs text-ink-500">
                        {lastMeasure ? (
                          <>
                            <p className="font-medium">{lastMeasure.weightKg} kg</p>
                            <p className="text-ink-400">{format(new Date(lastMeasure.date), 'dd/MM', { locale: ptBR })}</p>
                          </>
                        ) : (
                          <p className="text-ink-300">sem medida</p>
                        )}
                      </div>
                      <ChevronRight size={16} className="text-ink-300 group-hover:text-brand-600" />
                    </div>
                  </NextLink>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
