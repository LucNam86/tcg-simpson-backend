// middleware/jwt.middleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { id: string };
}

const SECRET = process.env.JWT_SECRET!;
if (!SECRET) {
  throw new Error(
    "CRITICAL: Le JWT_SECRET n'est pas défini dans l'environnement !",
  );
}

export const signToken = (payload: { id: string }): string => {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};

export const jwtMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "UNAUTHORIZED" });

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };
    
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
};
