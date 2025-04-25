import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();


router.patch("/goal", authenticateToken, async (req: AuthRequest, res): Promise<void> => {
    const { userId } = req.user!;
    const { goal } = req.body;
  
    if (typeof goal !== "number" || goal < 0) { 
      res.status(400).json({ error: "Invalid goal" });
      return;
    }
  
    const user = await prisma.user.update({
      where: { id: userId },
      data: { weeklyGoal: goal },
    });
  
    res.json({ weeklyGoal: user.weeklyGoal });
  });

  // router.put("/weekly-calorie-goal", authenticateToken, async (req: AuthRequest, res): Promise<void> => {
  //   const { userId } = req.user!;
  //   const { goal } = req.body;
  
  //   if (!goal || isNaN(goal)) {
  //     res.status(400).json({ error: "Invalid goal" });
  //     return;
  //   }
  
  //   await prisma.user.update({
  //     where: { id: userId },
  //     data: { weeklyCalorieGoal: parseInt(goal) },
  //   });
  
  //   res.sendStatus(200);
  // });

  router.put("/macro-goals", authenticateToken, async (req: AuthRequest, res): Promise<void> => {
    const { userId } = req.user!;
    const { calorie, protein, carbs, fat } = req.body;
  
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          weeklyCalorieGoal: parseInt(calorie),
          proteinTarget: parseInt(protein),
          carbsTarget: parseInt(carbs),
          fatTarget: parseInt(fat),
        },
      });
      res.sendStatus(200);
    } catch (err) {
      console.error("❌ Failed to update macro goals", err);
      res.status(500).send("Server error");
    }
  });

  router.get("/macro-goals", authenticateToken, async (req: AuthRequest, res): Promise<void> => {
    const { userId } = req.user!;
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          weeklyCalorieGoal: true,
          proteinTarget: true,
          carbsTarget: true,
          fatTarget: true,
        },
      });
  
      if (!user) {
        res.status(404).send("User not found");
        return;
      } 
  
      res.json(user);
    } catch (err) {
      console.error("❌ Failed to fetch macro targets", err);
      res.status(500).send("Server error");
    }
  });
  
  
  

  export default router;
  