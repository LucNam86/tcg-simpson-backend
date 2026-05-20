// src/app.ts
import express from 'express';
import { userRoutes } from './presentation/http/routes/user.routes';
import { TokenService } from '@application/ports/TokenService';
import { UserRepository } from '@domain/user';
import { PasswordHasher } from '@domain/user';

type AppInputs = {
  tokenService: TokenService;
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
};

export const createApp = (deps: AppInputs) => {
  const app = express();
  app.use(express.json());
  app.use('/users', userRoutes(deps));
  return app;
};