import express from 'express';
import mongoose from 'mongoose';
import { env } from '@config/env';
import userRoutes from '@routes/user';
import cardRoutes from '@routes/card';
import boosterRoutes from '@routes/booster';
import cors from 'cors';


async function main() {
  await mongoose.connect(env.DATABASE_URL);

  const app = express();
  app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
  app.use(express.json());
  app.use('/users', userRoutes);
  app.use('/cards', cardRoutes);
  app.use('/boosters', boosterRoutes);
  app.listen(env.PORT, () =>
    console.log(`API up on :${env.PORT}`)
  );
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});