import { Router } from 'express';
import { TokenService } from '@application/ports/TokenService';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';

type UserRoutesDeps = {
  tokenService: TokenService;};

export const userRoutes = ({ tokenService }: UserRoutesDeps) => {
  const router = Router();
  const auth = jwtAuthMiddleware(tokenService);

  router.get('/me', auth, (req, res) => {
    res.json({ user: req.user });
  });

  router.delete('/:id', auth, (_, res) => {
    res.status(204).end();
  });

  return router;
};