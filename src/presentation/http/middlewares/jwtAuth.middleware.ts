import { NextFunction, Request, Response } from 'express';
import { TokenService, AuthPayload } from '@application/ports/TokenService';

// Étend Express pour exposer req.user
declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthPayload;
  }
}

export const jwtAuthMiddleware = (tokenService: TokenService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing bearer token' });
    }

    const token = header.slice('Bearer '.length).trim();
    try {
      req.user = await tokenService.verify(token);
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};