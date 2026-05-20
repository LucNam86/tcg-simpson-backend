import express from 'express';
import mongoose from 'mongoose';
import { env } from '@config/env';
import userRoutes from '@routes/user.routes';

async function main() {
  await mongoose.connect(env.DATABASE_URL);

  const app = express();
  app.use(express.json());
  app.use('/users', userRoutes);

  app.listen(env.PORT, () =>
    console.log(`API up on :${env.PORT}`)
  );
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});