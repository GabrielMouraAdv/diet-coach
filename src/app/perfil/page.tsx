import { prisma } from '@/lib/db';
import { ProfileForm } from './ProfileForm';

export const dynamic = 'force-dynamic';

export default async function PerfilPage() {
  const user = await prisma.user.findFirst();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Perfil</h1>
      <p className="text-sm text-ink-400 mb-6">
        Suas medidas e objetivos — base para todos os cálculos do app.
      </p>
      <ProfileForm user={user} />
    </div>
  );
}
