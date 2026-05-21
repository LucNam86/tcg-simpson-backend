// routes/user.ts
import { Router } from "express";
import { RegisterSchema,ConnectSchema } from "@shared/Schemas/user.schema";
import {
  registerUser,connectUser
} from "@services/user";
import { signToken } from "@middleware/jwt.middleware";

const router = Router();


router.post("/register", async (req, res) => {
  const body = RegisterSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "EMAIL_INVALID" });

  const result = await registerUser(body.data);
  if (!result.ok) {
    if (result.error === "EMAIL_TAKEN")
      return res.status(409).json({ error: result.error });
    return res.status(400).json({ error: result.error });
  }

  const token = signToken({ id: result.value.id });
  return res.status(201).json({ token, ...result.value});
});

router.post("/connect", async (req, res) => {
  const body = ConnectSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "INPUT_INVALID" });

  const result = await connectUser(body.data);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  const token = signToken({ id: result.value.id });
  return res.status(201).json({ token, ...result.value});
});

export default router;
