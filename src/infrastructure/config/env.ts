import dotenvSafe from 'dotenv-safe';
import path from 'node:path';
import { z } from 'zod';

// Charge .env et vérifie qu'il contient toutes les clés de .env.example
dotenvSafe.config({
//process.cwd() retourne le répertoire de travail courant
  path: path.resolve(process.cwd(), '.env'),
  example: path.resolve(process.cwd(), '.env.example'),
  allowEmptyValues: false, // refuse les valeurs vides en plus des clés manquantes
});

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().int().positive().default(3000),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit faire au moins 32 caractères'),
  JWT_ISSUER: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),

  DATABASE_URL: z.url(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Variables d\'environnement invalides :', parsed.error.issues);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;