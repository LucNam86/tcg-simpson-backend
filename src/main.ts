import express from 'express';
import mongoose from 'mongoose';
import { env } from './infrastructure/config/env';
import { makeJwtTokenService } from './infrastructure/auth/JwtTokenService';
import { makeMongoUserRepository } from './infrastructure/mongo/user/MongoUserRepository';
import { makeBcryptPasswordHasher } from './infrastructure/bcrypt/bcryptPasswordHasher';

import { userRoutes } from './presentation/http/routes/user.routes'


async function main() {
  await mongoose.connect(env.DATABASE_URL);

  const tokenService = makeJwtTokenService(env.JWT_SECRET, env.JWT_ISSUER, env.JWT_EXPIRES_IN);
  const userRepository = makeMongoUserRepository();
  const passwordHasher = makeBcryptPasswordHasher();
  const app = express();
  app.use(express.json());
  app.use('/users', userRoutes({ tokenService,userRepository, passwordHasher }));

  app.listen(env.PORT, () => console.log(`API up on :${env.PORT}`));
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});