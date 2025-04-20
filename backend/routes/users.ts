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

  export default router;
  