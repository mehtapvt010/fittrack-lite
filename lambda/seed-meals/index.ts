// lambda/seed-meals/seed-meals.ts

import { PrismaClient } from "../../backend/node_modules/@prisma/client";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  const yesterday = subDays(new Date(), 1);

  await prisma.meal.createMany({
    data: [
      {
        id: "meal1",
        userId: "4ffc67b1-c155-4da5-af37-cf406830c97a", // change this!
        protein: 30,
        calories: 500,
        carbs: 50,
        fat: 20,
        name: "Test Breakfast",
        createdAt: yesterday,
        mismatch: false,
      },
      {
        id: "meal2",
        userId: "4ffc67b1-c155-4da5-af37-cf406830c97a", // change this!
        protein: 20,
        calories: 400,
        carbs: 40,
        fat: 10,
        name: "Test Lunch",
        createdAt: yesterday,
        mismatch: false,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded some test meals for yesterday!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
