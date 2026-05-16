'use client';

import { useState, use } from 'react';
import { loginAction } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';

export function LoginForm({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = use(searchParams);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginAction(email, password, next);
      if (result?.error) setError(result.error);
    } catch {
      // redirect lança exceção que é tratada pelo Next.js
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label className="label">Senha</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          minLength={6}
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Entrar'}
      </button>

      <p className="text-center text-xs text-ink-400">
        Novo por aqui? Use o link de convite enviado pelo seu coach.
      </p>
    </form>
  );
}
