import { LoginForm } from './LoginForm';

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">🥗</span>
          <h1 className="text-2xl font-bold text-ink-800 mt-3">Diet Coach</h1>
          <p className="text-ink-400 text-sm mt-1">Seu coach de bem-estar</p>
        </div>
        <div className="card">
          <LoginForm searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}
