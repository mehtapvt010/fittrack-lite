import { z } from "zod";

export const createWorkoutSchema = z.object({
  date: z.coerce.date(),            // allows “2025‑04‑19” or ISO strings
  exercise: z.string().min(2),
  sets: z
    .array(
      z.object({
        reps: z.number().int().positive(),
        weight: z.number().nonnegative(),   // kg or lb – we’ll store raw number
      })
    )
    .min(1),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
