// backend/scripts/seedMismatch.ts

import 'dotenv/config';               // loads DATABASE_URL from .env
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  // 1. pick any existing user (you can also hard-code a userId)
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('❌ No user found. Please create at least one User in your DB.');
    process.exit(1);
  }

  // 2. insert a fake mismatch row
  const mismatch = await prisma.macroMismatch.create({
    data: {
      userId: user.id,
      date: new Date(),
      calorieDelta: 500,    // +500 over goal
      proteinDelta: -20,    // 20g under
      carbsDelta: 100,      // +100 over
      fatDelta: -10,        // 10g under
    },
  });

  console.log('✅ Seeded MacroMismatch:', mismatch);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('💥 Error seeding mismatch:', e);
  process.exit(1);
});
