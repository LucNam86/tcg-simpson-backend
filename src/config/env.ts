import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string(),
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default(12),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variables d\'environnement invalides:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;