// routes/user.ts
import { Router } from 'express';
import { z } from 'zod';
import { createUser } from '../services/user.service';
import { signToken } from '../middleware/jwt.middleware';

const router = Router();

const RegisterSchema = z.object({
  pseudo: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

router.post('/register', async (req, res) => {
  const body = RegisterSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: 'EMAIL_INVALID' });

  const result = await createUser(body.data);
  if (!result.ok) {
    if (result.error === 'EMAIL_TAKEN') return res.status(409).json({ error: result.error });
    return res.status(400).json({ error: result.error });
  }

  const token = signToken({ id: result.value.id });
  return res.status(201).json({ token });
});

export default router;