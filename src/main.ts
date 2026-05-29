import express from 'express';
import mongoose from 'mongoose';
import { env } from '@config/env';
import userRoutes from '@routes/user';
import cardRoutes from '@routes/card';
import boosterRoutes from '@routes/booster';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('/boosters', boosterRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "TCG Simpson API" });
});

mongoose.connect(env.DATABASE_URL).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

// Pour le dev local
if (process.env.NODE_ENV !== 'production') {
  app.listen(env.PORT, () => console.log(`API up on :${env.PORT}`));
}

export default app;