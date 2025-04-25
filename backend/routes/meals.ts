import express from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

// GET /meals/today
router.get("/today", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const meals = await prisma.meal.findMany({
      where: {
        userId: req.user!.userId,
        createdAt: {
          gte: new Date(`${today}T00:00:00.000Z`)
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(meals);
  } catch (err) {
    next(err);
  }
});

router.get("/week", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.user!;
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const meals = await prisma.meal.findMany({
      where: {
        userId,
        createdAt: {
          gte: start,
        },
      },
    });

    res.json(meals);
  } catch (err) {
    console.error("❌ Failed to fetch weekly meals", err);
    res.status(500).send("Server error");
  }
});

router.get("/week-summary", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.user!;
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { weeklyCalorieGoal: true },
    });

    const meals = await prisma.meal.findMany({
      where: {
        userId,
        createdAt: { gte: start },
      },
    });

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

    res.json({
      goal: user?.weeklyCalorieGoal || 0,
      actual: totalCalories,
    });
  } catch (err) {
    console.error("❌ Failed to fetch summary", err);
    res.status(500).send("Server error");
  }
});

router.get("/macro-summary", authenticateToken, async (req: AuthRequest, res) => {
  const { userId } = req.user!;
  const start = new Date();
  start.setDate(start.getDate() - 6);

  const meals = await prisma.meal.findMany({
    where: {
      userId,
      createdAt: { gte: start },
    },
  });

  const totals = meals.reduce(
    (acc, m) => {
      acc.protein += m.protein;
      acc.carbs += m.carbs;
      acc.fat += m.fat;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  res.json(totals);
});



export default router;
