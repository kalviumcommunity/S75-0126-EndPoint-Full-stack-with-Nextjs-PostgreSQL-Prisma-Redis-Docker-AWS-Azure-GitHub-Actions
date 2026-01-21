import { prisma } from '../src/lib/prisma';

async function main() {
  await prisma.users.createMany({
    data: [
      { phone: '+1234567890' },
      { phone: '+0987654321' },
    ],
  });

  console.log('Database seeded ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
