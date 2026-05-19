import { z } from 'zod';

export const RegisterUserSchema = z.object({
  pseudo: z.string().min(3),
  email: z.string(),
  password: z.string().min(8),
});

export type RegisterUserPayload = z.infer<typeof RegisterUserSchema>;