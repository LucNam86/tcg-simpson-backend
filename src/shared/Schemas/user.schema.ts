// shared/schemas/user.schemas.ts
import { z } from 'zod';

export const RegisterSchema = z.object({
  pseudo: z.string().min(3).max(20),
  email: z.email(),
  password: z.string().min(8).max(72),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ConnectSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
});

export type ConnectInput = z.infer<typeof ConnectSchema>;

export const UpdateUserSchema = z.object({
  pseudo: z.string().min(3).max(20).optional(),
  password: z.string().min(8).max(72).optional(),
}).strict();

export type UpdateInput = z.infer<typeof UpdateUserSchema>;

export const PublicUserSchema = z.object({
  id: z.string(),
  pseudo: z.string(),
  email: z.string(),
  avatar: z.string(),
  money: z.number(),
  myCollection: z.array(z.string()),
  boosters : z.array(z.string()),
  deck: z.array(z.string()),
  darkMode: z.boolean(),
});

export type PublicUser = z.infer<typeof PublicUserSchema>;