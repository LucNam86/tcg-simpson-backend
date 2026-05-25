// routes/user.ts
import { Router } from "express";
import {
  updateUser,
  updateDeck,
  setActiveDeck,
} from "@services/user";
import { jwtMiddleware,AuthRequest } from "@middleware/jwt.middleware";
import { UpdateUserSchema } from "@shared/Schemas/user.schema";

const router = Router();

router.put("/me/profile", jwtMiddleware, async (req : AuthRequest, res) => {
  const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const body = UpdateUserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ error: body.error });
  }

  if (Object.keys(body.data).length === 0) {
    return res.status(400).json({ error: "No fields to update provided." });
  }

  const result = await updateUser(userId, body.data);
  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") return res.status(404).json({ error: result.error });
    return res.status(400).json({ error: result.error });
  }
  return res.json(result.value);
});

router.put("/me/decks/:deckId", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const { deckId } = req.params;
  const { name, cards } = req.body;

  if (!deckId || typeof deckId !== "string") return res.status(400).json({ error: "MISSING_DECK_ID" });

  const result = await updateDeck(userId, deckId, { name, cards });
  if (!result.ok) {
    if (["DECK_NOT_FOUND", "USER_NOT_FOUND"].includes(result.error)) return res.status(404).json({ error: result.error });
    if (result.error === "UNAUTHORIZED_DECK") return res.status(403).json({ error: result.error });
    return res.status(400).json({ error: result.error });
  }

  return res.json(result.value);
});

router.put("/me/decks/:deckId/active", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const { deckId } = req.params;
  if (!deckId || typeof deckId !== "string") return res.status(400).json({ error: "MISSING_DECK_ID" });

  const result = await setActiveDeck(userId, deckId);
  if (!result.ok) {
    if (["DECK_NOT_FOUND", "USER_NOT_FOUND"].includes(result.error)) return res.status(404).json({ error: result.error });
    if (result.error === "UNAUTHORIZED_DECK") return res.status(403).json({ error: result.error });
    return res.status(400).json({ error: result.error });
  }

  return res.json({ success: true });
});

export default router;
