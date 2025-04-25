import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import dashboard from "../services/dashboard";
import { PrismaClient } from "@prisma/client";
import { redis } from "../lib/redis";

const prisma = new PrismaClient();

const router = Router();

router.get("/volume", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.user!;
    const total = await dashboard.todayVolume(userId);
    res.json(total);
  } catch (err) {
    next(err);
  }
});

router.get("/exercises", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.user!;
    const list = await dashboard.todayExercises(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.get("/volume/yesterday", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.user!;
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86_400_000);

    const start = new Date(yesterday.toISOString().slice(0, 10));
    const end = new Date(start.getTime() + 86_400_000);

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        date: { gte: start, lt: end },
      },
    });

    const total = (workouts as any[]).reduce((acc, w) => acc + w.sets * w.reps * w.weight, 0);
    res.json(total);
  } catch (err) {
    next(err);
  }
});


router.get("/goal-status", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.user!;
    const goal = await redis.get<boolean>(`goalReached:${userId}`);
    res.json({ reached: goal === true });
  } catch (err) {
    next(err);
  }
});

router.get("/progress-stream", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.user!;
    const streamKey = `workoutLog:${userId}`;

    const raw = await redis.xrange(streamKey, "-", "+", 5); // ✅ correct for Upstash

    const entries = Object.entries(raw).map(([id, message]) => ({
      id,
      ...message,
    }));

    //console.log("📊 Formatted entries:", entries);

    res.json(entries.reverse());
  } catch (err) {
    console.error("❌ Redis stream fetch failed:", err);
    res.status(500).json({ error: "Could not fetch workout stream" });
  }
});




export default router;