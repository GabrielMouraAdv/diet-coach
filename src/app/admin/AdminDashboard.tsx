'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import type { User, Account, Measurement, Invite, Consultation } from '@prisma/client';
import { createInviteAction, logoutAction } from '@/app/actions/auth';
import { scheduleConsultation, completeConsultation } from '@/app/actions/consultations';
import { format, formatDistanceToNow, addDays, isPast, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Plus, Copy, Check, LogOut, Users, Clock, Link as LinkIcon, ChevronRight,
  Calendar, CalendarCheck, CalendarPlus, AlertCircle, Activity,
} from 'lucide-react';

type ClientWithRelations = User & {
  account: Pick<Account, 'email' | 'createdAt'>;
  measurements: Measurement[];
  consultations: Consultation[];
};

type ConsultationWithUser = Consultation & {
  user: Pick<User, 'id' | 'name'>;
};

interface Props {
  clients: ClientWithRelations[];
  pendingInvites: Invite[];
  upcomingConsultations: ConsultationWithUser[];
}

type Tab = 'acompanhamento' | 'gerencial' | 'agenda';

export function AdminDashboard({ clients, pendingInvites, upcomingConsultations }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [tab, setTab] = useState<Tab>('acompanhamento');

  // Estado convite
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newInviteUrl, setNewInviteUrl] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Estado consulta
  const [scheduleFor, setScheduleFor] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleType, setScheduleType] = useState<'inicial' | 'retorno' | 'ajuste' | 'avaliacao'>('retorno');

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const now = new Date();
  const overdueCount = clients.filter(c => {
    const last = c.consultations.find(co => co.completedAt);
    if (!last) return false;
    const next = c.consultations.find(co => !co.completedAt && new Date(co.scheduledAt) > now);
    return !next && differenceInDays(now, last.completedAt!) > 30;
  }).length;

  const scheduledCount = clients.filter(c =>
    c.consultations.some(co => !co.completedAt && new Date(co.scheduledAt) > now)
  ).length;

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleCreateInvite = () => {
    start(async () => {
      const res = await fetch('/api/admin/account-id');
      const { accountId } = await res.json();
      const invite = await createInviteAction({ adminAccountId: accountId, clientName: inviteName, clientEmail: inviteEmail });
      setNewInviteUrl(`${window.location.origin}/convite/${invite.token}`);
      setInviteName(''); setInviteEmail('');
      router.refresh();
    });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSchedule = (userId: string) => {
    if (!scheduleDate) return;
    start(async () => {
      await scheduleConsultation({ userId, scheduledAt: scheduleDate, type: scheduleType });
      setScheduleFor(null); setScheduleDate('');
      router.refresh();
    });
  };

  const handleComplete = (id: string) => {
    if (!confirm('Marcar consulta como realizada?')) return;
    start(async () => {
      await completeConsultation(id);
      router.refresh();
    });
  };

  const handleLogout = () => start(async () => { await logoutAction(); });

  // ─── Render ────────────────────────────────────────────────────────────────
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

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* Stats sempre visíveis */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<Users size={16} />} label="Pacientes" value={clients.length} color="brand" />
          <StatCard icon={<CalendarCheck size={16} />} label="Agendados" value={scheduledCount} color="blue" />
          <StatCard icon={<AlertCircle size={16} />} label="Sem retorno" value={overdueCount} color="red" />
          <StatCard icon={<Clock size={16} />} label="Convites" value={pendingInvites.length} color="yellow" />
        </div>

        {/* Abas */}
        <div className="bg-white border rounded-2xl p-1 flex shadow-sm">
          <TabBtn active={tab === 'acompanhamento'} onClick={() => setTab('acompanhamento')} icon={<Activity size={15} />} label="Acompanhamento" />
          <TabBtn active={tab === 'agenda'}         onClick={() => setTab('agenda')}         icon={<Calendar size={15} />}  label="Agenda" />
          <TabBtn active={tab === 'gerencial'}      onClick={() => setTab('gerencial')}      icon={<LinkIcon size={15} />}  label="Gerencial" />
        </div>

        {/* ─────────── ABA ACOMPANHAMENTO ─────────── */}
        {tab === 'acompanhamento' && (
          <section className="card">
            <h2 className="font-semibold mb-3">Pacientes ({clients.length})</h2>
            {clients.length === 0 ? (
              <p className="text-sm text-ink-400 text-center py-6">
                Nenhum paciente ainda. Vá em <strong>Gerencial</strong> e gere o primeiro convite.
              </p>
            ) : (
              <div className="space-y-2">
                {clients.map(c => {
                  const lastConsult   = c.consultations.find(co => co.completedAt);
                  const nextConsult   = c.consultations.find(co => !co.completedAt && new Date(co.scheduledAt) > now);
                  const lastMeasure   = c.measurements[0];
                  const daysSinceLast = lastConsult ? differenceInDays(now, new Date(lastConsult.completedAt!)) : null;
                  const overdue       = !nextConsult && daysSinceLast !== null && daysSinceLast > 30;
                  const dueSoon       = nextConsult && differenceInDays(new Date(nextConsult.scheduledAt), now) <= 7;

                  return (
                    <div key={c.id} className={`border rounded-xl overflow-hidden ${
                      overdue ? 'border-red-200 bg-red-50/30' : dueSoon ? 'border-yellow-200 bg-yellow-50/30' : 'border-ink-200'
                    }`}>
                      <NextLink href={`/admin/cliente/${c.id}`} className="flex items-center justify-between p-3 hover:bg-brand-50/40 group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate group-hover:text-brand-700">{c.name}</p>
                            <p className="text-xs text-ink-400 truncate">{c.account.email}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-ink-300 group-hover:text-brand-600 flex-shrink-0" />
                      </NextLink>

                      <div className="border-t border-current/10 px-3 py-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div>
                          <p className="text-ink-400">Peso atual</p>
                          <p className="font-medium">{lastMeasure ? `${lastMeasure.weightKg} kg` : '—'}</p>
                        </div>
                        <div>
                          <p className="text-ink-400">Última consulta</p>
                          <p className="font-medium">
                            {lastConsult
                              ? <>{format(new Date(lastConsult.completedAt!), 'dd/MM/yy', { locale: ptBR })} <span className="text-ink-400">({daysSinceLast}d)</span></>
                              : <span className="text-ink-300">—</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-ink-400">Próxima consulta</p>
                          <p className={`font-medium ${overdue ? 'text-red-600' : dueSoon ? 'text-yellow-700' : ''}`}>
                            {nextConsult
                              ? format(new Date(nextConsult.scheduledAt), "dd/MM 'às' HH:mm", { locale: ptBR })
                              : overdue ? '⚠️ Atrasado' : <span className="text-ink-300">não agendada</span>}
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          {nextConsult ? (
                            <button onClick={() => handleComplete(nextConsult.id)} disabled={pending} className="text-xs px-2 py-1 rounded bg-brand-600 text-white hover:bg-brand-700">
                              ✓ Realizada
                            </button>
                          ) : (
                            <button onClick={() => { setScheduleFor(c.id); setScheduleDate(format(addDays(now, 30), "yyyy-MM-dd'T'HH:mm")); }} className="text-xs px-2 py-1 rounded bg-white border border-brand-300 text-brand-700 hover:bg-brand-50">
                              <CalendarPlus size={12} className="inline mr-1" /> Agendar
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Form inline de agendamento */}
                      {scheduleFor === c.id && (
                        <div className="border-t bg-white px-3 py-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="label text-xs">Data e hora</label>
                              <input
                                type="datetime-local"
                                className="input text-sm"
                                value={scheduleDate}
                                onChange={e => setScheduleDate(e.target.value)}
                                min={format(now, "yyyy-MM-dd'T'HH:mm")}
                              />
                            </div>
                            <div>
                              <label className="label text-xs">Tipo</label>
                              <select className="input text-sm" value={scheduleType} onChange={e => setScheduleType(e.target.value as typeof scheduleType)}>
                                <option value="retorno">Retorno</option>
                                <option value="inicial">Consulta inicial</option>
                                <option value="ajuste">Ajuste de plano</option>
                                <option value="avaliacao">Avaliação física</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleSchedule(c.id)} disabled={pending || !scheduleDate} className="btn-primary text-sm flex-1 py-1.5">
                              {pending ? 'Agendando...' : 'Confirmar agendamento'}
                            </button>
                            <button onClick={() => setScheduleFor(null)} className="btn-ghost text-sm py-1.5">Cancelar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ─────────── ABA AGENDA ─────────── */}
        {tab === 'agenda' && (
          <section className="card">
            <h2 className="font-semibold mb-3">Próximas consultas</h2>
            {upcomingConsultations.length === 0 ? (
              <p className="text-sm text-ink-400 text-center py-6">Nenhuma consulta agendada nos próximos dias.</p>
            ) : (
              <div className="space-y-2">
                {upcomingConsultations.map(co => {
                  const days = differenceInDays(new Date(co.scheduledAt), now);
                  const isToday = days === 0;
                  const dueSoon = days >= 0 && days <= 7;
                  return (
                    <div key={co.id} className={`flex items-center justify-between p-3 rounded-xl border ${
                      isToday ? 'border-brand-300 bg-brand-50' : dueSoon ? 'border-yellow-200 bg-yellow-50/40' : 'border-ink-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className={isToday ? 'text-brand-700' : 'text-ink-400'} />
                        <div>
                          <NextLink href={`/admin/cliente/${co.user.id}`} className="font-medium text-sm hover:text-brand-700">
                            {co.user.name}
                          </NextLink>
                          <p className="text-xs text-ink-500 capitalize">{co.type} · {format(new Date(co.scheduledAt), "EEEE, dd 'de' MMM 'às' HH:mm", { locale: ptBR })}</p>
                          {co.notes && <p className="text-xs text-ink-500 italic mt-0.5">{co.notes}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`badge text-xs ${
                          isToday ? 'bg-brand-100 text-brand-700' :
                          dueSoon ? 'bg-yellow-100 text-yellow-700' :
                          'bg-ink-100 text-ink-600'
                        }`}>
                          {isToday ? 'Hoje' : days === 1 ? 'Amanhã' : `em ${days}d`}
                        </span>
                        <button onClick={() => handleComplete(co.id)} disabled={pending} title="Marcar como realizada" className="p-1.5 rounded hover:bg-brand-100 text-brand-700">
                          <Check size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ─────────── ABA GERENCIAL ─────────── */}
        {tab === 'gerencial' && (
          <div className="space-y-4">
            <section className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Convite de novo paciente</h2>
                <button onClick={() => setShowInviteForm(v => !v)} className="btn-primary text-sm flex items-center gap-1.5 py-1.5 px-3">
                  <Plus size={15} /> {showInviteForm ? 'Cancelar' : 'Gerar link'}
                </button>
              </div>

              {showInviteForm && (
                <div className="space-y-3 border-t pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="label">Nome do paciente</label>
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
                        <button onClick={() => copyUrl(newInviteUrl)} className={`btn text-xs px-3 py-2 ${copied === newInviteUrl ? 'bg-brand-600 text-white' : 'bg-white border'}`}>
                          {copied === newInviteUrl ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <p className="text-xs text-ink-400">Envie via WhatsApp, email ou onde preferir.</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className="card">
              <h2 className="font-semibold mb-3">Convites aguardando uso ({pendingInvites.length})</h2>
              {pendingInvites.length === 0 ? (
                <p className="text-sm text-ink-400 text-center py-4">Nenhum convite pendente.</p>
              ) : (
                <div className="space-y-2">
                  {pendingInvites.map(inv => {
                    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/convite/${inv.token}`;
                    return (
                      <div key={inv.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{inv.clientName ?? 'Sem nome'}</p>
                          <p className="text-xs text-ink-400">
                            {inv.clientEmail && <>{inv.clientEmail} · </>}
                            Expira {formatDistanceToNow(new Date(inv.expiresAt), { locale: ptBR, addSuffix: true })}
                          </p>
                        </div>
                        <button onClick={() => copyUrl(url)} className={`btn text-xs py-1 px-2 flex items-center gap-1 ${copied === url ? 'bg-brand-600 text-white' : 'btn-ghost'}`}>
                          {copied === url ? <Check size={12} /> : <Copy size={12} />}
                          {copied === url ? 'Copiado!' : 'Copiar link'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers de UI ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: 'brand' | 'blue' | 'red' | 'yellow' }) {
  const colors = {
    brand:  'bg-brand-100 text-brand-700',
    blue:   'bg-blue-100 text-blue-700',
    red:    'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <div className="card flex items-center gap-3 py-3">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="text-xs text-ink-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-xl transition-colors ${
        active ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-50'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
