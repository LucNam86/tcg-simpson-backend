// routes/user.ts
import { Router } from "express";
import { z } from "zod";
import {
  createUser,
  getUserById,
  updateUser,
  connectUser,
} from "../services/user.service";
import { signToken, jwtMiddleware } from "../middleware/jwt.middleware";

const router = Router();

const RegisterSchema = z.object({
  pseudo: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

const ConnectSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const UpdateUserSchema = z
  .object({
    pseudo: z.string().min(3).optional(),
    password: z.string().min(8).optional(),
  })
  .strict();

router.post("/register", async (req, res) => {
  const body = RegisterSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "EMAIL_INVALID" });

  const result = await createUser(body.data);
  if (!result.ok) {
    if (result.error === "EMAIL_TAKEN")
      return res.status(409).json({ error: result.error });
    return res.status(400).json({ error: result.error });
  }

  const token = signToken({ id: result.value.id });
  return res.status(201).json({ token });
});

router.post("/connect", async (req, res) => {
  const body = ConnectSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "INPUT_INVALID" });

  const result = await connectUser(body.data);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  const token = signToken({ id: result.value.id });
  return res.status(201).json({ token });
});

router.get("/profile", jwtMiddleware, async (req, res) => {
  const userId = (req as any).user.id;
  const result = await getUserById(userId);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.json(result.value);
});

router.put("/profile", jwtMiddleware, async (req, res) => {
  const userId = (req as any).user.id;
  const body = UpdateUserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ error: body.error });
  }

  if (Object.keys(body.data).length === 0) {
    return res.status(400).json({ error: "No fields to update provided." });
  }

  const result = await updateUser(userId, body.data);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }
  return res.json(result.value);
});

export default router;
