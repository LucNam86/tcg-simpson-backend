import express from 'express';
import mongoose from 'mongoose';
import { env } from './infrastructure/config/dotenv/env';
import { createApp } from './app';
import { makeJwtTokenService } from './infrastructure/auth/jwt/JwtTokenService';
import { makeMongoUserRepository } from './infrastructure/database/mongo/user/MongoUserRepository';
import { makeBcryptPasswordHasher } from './infrastructure/hashing/bcrypt/bcryptPasswordHasher';

import { userRoutes } from './presentation/http/routes/user.routes'


async function main() {
  await mongoose.connect(env.DATABASE_URL);

  const tokenService = makeJwtTokenService(env.JWT_SECRET, env.JWT_ISSUER, env.JWT_EXPIRES_IN);
  const userRepository = makeMongoUserRepository();
  const passwordHasher = makeBcryptPasswordHasher();

  const app = createApp({ tokenService, userRepository, passwordHasher })
  app.listen(env.PORT, () => console.log(`API up on :${env.PORT}`));
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});