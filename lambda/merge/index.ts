import { PrismaClient } from "../../backend/node_modules/@prisma/client";
import { subDays, startOfDay, endOfDay } from "date-fns";

const prisma = new PrismaClient();

export const handler = async (): Promise<void> => {
  const yesterdayStart = startOfDay(subDays(new Date(), 1));
  const yesterdayEnd   = endOfDay(subDays(new Date(), 1));

  console.log("🔍 Scanning meals from", yesterdayStart, "to", yesterdayEnd);

  const meals = await prisma.meal.findMany({
    where: {
      createdAt: { gte: yesterdayStart, lt: yesterdayEnd },
    },
  });

  const updates = meals.map((meal: any) => {
    const expected = meal.protein * 4; // Simple kcal from protein
    const isMismatch = meal.calories !== expected;
    return prisma.meal.update({
      where: { id: meal.id },
      data: { mismatch: isMismatch },
    });
  });

  const results = await Promise.all(updates);

  console.table(
    results.map(r => ({
      id: r.id,
      userId: r.userId,
      name: r.name,
      date: r.createdAt.toISOString().slice(0, 10),
      calories: r.calories,
      protein: r.protein,
      carbs: r.carbs,
      fat: r.fat,
      mismatch: r.mismatch,
    }))
  );

  await prisma.$disconnect();
};
