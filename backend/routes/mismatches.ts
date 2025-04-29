import express from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();


router.get("/", authenticateToken, async (req: AuthRequest, res) => {
    const { userId } = req.user!;
    const items = await prisma.macroMismatch.findMany({
      where: { userId, resolved: false },
      orderBy: { date: 'desc' },
    });
    res.json(items);
  });
  
  router.post("/:id/resolve", authenticateToken, async (req: AuthRequest, res) => {
    const { id } = req.params;
    const mm = await prisma.macroMismatch.update({
      where: { id },
      data: { resolved: true },
    });
    res.json(mm);
  });
  
  export default router;