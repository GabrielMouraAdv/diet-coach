import { PrismaClient } from '@prisma/client';
import { TACO_FOODS } from './taco-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TACO foods...');
  let created = 0;
  let updated = 0;

  for (const f of TACO_FOODS) {
    const existing = await prisma.food.findFirst({
      where: { source: 'TACO', externalId: f.externalId },
    });
    if (existing) {
      await prisma.food.update({ where: { id: existing.id }, data: f });
      updated++;
    } else {
      await prisma.food.create({ data: f });
      created++;
    }
  }

  console.log(`✅ ${created} criados, ${updated} atualizados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
