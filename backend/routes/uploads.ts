import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { generateMealCsvPresignedPost } from "../utils/s3";

const router = Router();

/**
 * POST /api/uploads/meal-csv
 * Body: none (user is inferred from JWT)
 * Returns: { url, fields, key }
 */
router.post("/meal-csv", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.user!;
    const presigned = await generateMealCsvPresignedPost(userId);
    res.json(presigned);
  } catch (err) {
    next(err);
  }
});

export default router;
