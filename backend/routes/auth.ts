import express, { Request, Response } from 'express';
import prisma from '../prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";


const router = express.Router();

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/** POST /api/auth/register  */
router.post(
  '/register',
  async (req: Request, res: Response): Promise<void> => {
    const parsed = AuthSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() });
      return;
    }

    const { email, password } = parsed.data;

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        res.status(400).json({ error: 'Email already taken' });
        return;
      }

      const hashed = await hashPassword(password);
      const user = await prisma.user.create({
        data: { id: uuidv4(),
          email, 
          password: hashed },
      });

      res.json({ token: generateToken(user.id) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

/** POST /api/auth/login  */
router.post(
  '/login',
  async (req: Request, res: Response): Promise<void> => {
    
    const parsed = AuthSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() });
      return;
    }

    const { email, password } = parsed.data;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await comparePassword(password, user.password))) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      res.json({ token: generateToken(user.id) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

router.get("/me", authenticateToken, async (req: AuthRequest, res): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, weeklyGoal: true }, // keep it minimal
  });

  if (!user){
    res.status(404).json({ error: "User not found" });
    return;
  } 

  res.json({ user });
});

export default router;
