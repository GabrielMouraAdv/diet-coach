/**
 * Cria a conta admin inicial.
 * Rode: npx tsx prisma/create-admin.ts
 *
 * Opcionalmente passe email e senha por variável de ambiente:
 *   ADMIN_EMAIL=gabriel@email.com ADMIN_PASSWORD=suasenha npx tsx prisma/create-admin.ts
 */
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

async function ask(question: string, hidden = false): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    if (hidden && process.stdin.isTTY) process.stdin.setRawMode?.(true);
    rl.question(question, answer => {
      if (hidden) process.stdout.write('\n');
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;

  if (!email) email = await ask('Email do admin: ');
  if (!password) password = await ask('Senha (mín. 6 chars): ', true);

  if (!email || !password || password.length < 6) {
    console.error('❌ Email ou senha inválidos.');
    process.exit(1);
  }

  const existing = await prisma.account.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    if (existing.role === 'admin') {
      console.log('✅ Admin já existe:', email);
    } else {
      console.log('⚠️  Conta já existe mas não é admin. Promovendo...');
      await prisma.account.update({ where: { id: existing.id }, data: { role: 'admin' } });
      console.log('✅ Conta promovida a admin.');
    }
    process.exit(0);
  }

  const passwordHash = await hash(password, 12);
  const account = await prisma.account.create({
    data: { email: email.toLowerCase(), passwordHash, role: 'admin' },
  });

  console.log(`✅ Admin criado com sucesso!`);
  console.log(`   Email: ${account.email}`);
  console.log(`   ID:    ${account.id}`);
  console.log(`\n   Acesse /login e entre com suas credenciais.`);
  console.log(`   Depois vá para /admin para gerenciar clientes.\n`);
}

main()
  .catch(e => { console.error('❌ Erro:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
