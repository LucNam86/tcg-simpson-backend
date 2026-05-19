import { Router } from 'express';
import { TokenService } from '@application/ports/TokenService';
import { UserRepository } from '@domain/user/UserRepository';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';

type UserRoutesDeps = {
  tokenService: TokenService;
  userRepository: UserRepository;
};

export const userRoutes = ({ tokenService, userRepository }: UserRoutesDeps) => {
  const router = Router();
  const auth = jwtAuthMiddleware(tokenService);

  router.get('/me', auth, (req, res) => {
    res.json({ user: req.user });
  });

  router.delete('/users/:id', auth, (_, res) => {
    res.status(204).end();
  });

  return router;
};