import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { createWorkoutSchema } from "../validators/workout";
import {startOfDay} from "date-fns";
import { redis } from "../lib/redis";
import dashboard from "../services/dashboard";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const router = Router();

router.post("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parsed = createWorkoutSchema.parse(req.body);
    const { userId } = req.user!;

    const workout = await prisma.workout.create({
      data: {
        id: uuidv4(),
        userId,
        date: parsed.date,
        exercise: parsed.exercise,
        sets: parsed.sets,
      },
    });

    // 1. Fetch user’s goal from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { weeklyGoal: true },
    });
    const weeklyGoal = user?.weeklyGoal ?? 20000; // fallback just in case
    
    // 2. Check weekly volume
    const weeklyVolume = await dashboard.thisWeekVolume(userId);
    //console.log("✅ Weekly volume:", weeklyVolume);

    // 3. Set or clear Redis flag based on actual goal
    if (weeklyVolume >= weeklyGoal) {
      await redis.set(`goalReached:${userId}`, true, { ex: 60 * 60 * 6 }); // 6h TTL
    } else {
      await redis.del(`goalReached:${userId}`);
    }

    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const total = (workout.sets as any).reduce(
      (acc : number, s : any) => acc + s.reps * s.weight,
      0
    );

    // Optional: log in console
    console.log("🚀 Logging to Redis stream:", {
      date: todayStr,
      exercise: parsed.exercise,
      volume: total.toString(),
    });

    await redis.xadd(`workoutLog:${userId}`, "*", {
      date: todayStr,
      exercise: parsed.exercise,
      volume: total.toString(),
    });

    res.status(201).json(workout);
  } catch (err) {
    console.error("❌ Workout POST failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/today", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.user!;
    const now = new Date();
    const yyyyMmDd = now.toISOString().slice(0, 10); // "2025-04-20"

    //console.log("📅 Fetching workouts for user:", userId, "on", yyyyMmDd);

    const dateStart = new Date(yyyyMmDd); // 2025-04-20T00:00:00Z
    const dateEnd = new Date(new Date(yyyyMmDd).getTime() + 24 * 60 * 60 * 1000); // next day

    const workouts = await prisma.workout.findMany({
      where: { userId, date: {
        gte: dateStart,
        lt: dateEnd,
      } },
    });

    res.json(workouts);
  } catch (err) {
    console.error("❌ Failed to fetch workouts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/week", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.user!;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        date: {
          gte: sevenDaysAgo,
          lte: now,
        },
      },
    });

    res.json(workouts);
  } catch (err) {
    console.error("❌ Failed to fetch weekly workouts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/dates", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.user!;
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // last 30 days

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        date: {
          gte: since,
        },
      },
      select: {
        date: true,
      },
    });

    const days = new Set(
      workouts.map((w) => startOfDay(new Date(w.date)).toISOString().slice(0, 10))
    );

    res.json(Array.from(days)); // ['2025-04-20', '2025-04-19', ...]
  } catch (err) {
    console.error("❌ Failed to fetch workout dates:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/all", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.user!;

    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.json(workouts);
  } catch (err) {
    console.error("❌ Failed to fetch all workouts:", err);
    res.status(500).json({ error: "Server error" });
  }
});



router.delete("/:id", authenticateToken, async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;

    const workout = await prisma.workout.findUnique({ where: { id } });

    if (!workout || workout.userId !== userId) { 
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    await prisma.workout.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to delete workout:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
