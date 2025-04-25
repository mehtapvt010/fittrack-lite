// backend/services/dashboard.ts
import { PrismaClient } from "@prisma/client";
import { cache } from "../utils/cache";

const prisma = new PrismaClient();

class DashboardService {
    
    @cache((userId: string) => `vol:${userId}:today`)
    public async todayVolume(userId: string): Promise<number> {
      //console.log("📦 thisWeekVolume called with:", userId);
      const start = startOfToday();
      const end = new Date(start.getTime() + 86_400_000); // +24 h
  
      const workouts = await prisma.workout.findMany({
        where: { userId, date: { gte: start, lt: end } },
      });
  
      return (workouts as any[]).reduce(
        (sum, w) => sum + (w.sets && w.sets.reduce((setsSum : number, set: any) => setsSum + set.reps * set.weight, 0)),
        0
      );
    }

    @cache((userId: string) => {
      if (!userId) throw new Error("userId is required for cache key");
      return `vol:${userId}:week`;
    })
    async thisWeekVolume(userId: string): Promise<number> {
      console.log("📦 thisWeekVolume called with:", userId);
    
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
      const workouts = await prisma.workout.findMany({
        where: {
          userId,
          date: {
            gte: weekAgo,
            lte: now,
          },
        },
      });
    
      const totalVolume = workouts.reduce(
        (acc, w) => acc + (w as any).sets.reduce((sAcc: number, s: any) => sAcc + s.reps * s.weight, 0),
        0
      );
    
      return totalVolume;
    }

  
    @cache((userId: string) => `exs:${userId}:today`)
    public async todayExercises(userId: string) {
      const start = startOfToday();
      const end = new Date(start.getTime() + 86_400_000);
  
      return prisma.workout.findMany({
        where: { userId, date: { gte: start, lt: end } },
        select: { exercise: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      });
    }
  
    // ───────────────────────────────────────────────────────────────
    // Helper
    // ───────────────────────────────────────────────────────────────
    private startCacheKey(userId: string, suffix: string) {
      return `${suffix}:${userId}:today`;
    }
  }
  
  function startOfToday(): Date {
    const iso = new Date().toISOString().slice(0, 10);
    return new Date(iso); // 00:00 local‑ISO
  }
  
  export default new DashboardService();