import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) : void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer xyz"

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
};
