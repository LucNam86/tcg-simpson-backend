// routes/user.ts
import { Router } from "express";
import { updateUser, updateMoney } from "@services/index";
import { updateDeck, activateDeck } from "@services/deck";
import { jwtMiddleware, AuthRequest } from "@middleware/jwt.middleware";
import { UpdateUserSchema } from "@shared/Schemas/user.schema";
import { addBooster } from "@services/booster/booster.add";

const router = Router();

router.put("/me/profile", jwtMiddleware, async (req: AuthRequest, res) => {
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
    if (result.error === "USER_NOT_FOUND")
      return res.status(404).json({ error: result.error });
    return res.status(400).json({ error: result.error });
  }
  return res.json(result.value);
});

router.put(
  "/me/decks/:deckId",
  jwtMiddleware,
  async (req: AuthRequest, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const { deckId } = req.params;
    const { name, cards } = req.body;

    if (!deckId || typeof deckId !== "string")
      return res.status(400).json({ error: "MISSING_DECK_ID" });

    const result = await updateDeck(userId, deckId, { name, cards });
    if (!result.ok) {
      if (["DECK_NOT_FOUND", "USER_NOT_FOUND"].includes(result.error))
        return res.status(404).json({ error: result.error });
      if (result.error === "UNAUTHORIZED_DECK")
        return res.status(403).json({ error: result.error });
      return res.status(400).json({ error: result.error });
    }

    return res.json(result.value);
  },
);

router.put(
  "/me/decks/:deckId/active",
  jwtMiddleware,
  async (req: AuthRequest, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const { deckId } = req.params;
    if (!deckId || typeof deckId !== "string")
      return res.status(400).json({ error: "MISSING_DECK_ID" });

    const result = await activateDeck(userId, deckId);
    if (!result.ok) {
      if (["DECK_NOT_FOUND", "USER_NOT_FOUND"].includes(result.error))
        return res.status(404).json({ error: result.error });
      if (result.error === "UNAUTHORIZED_DECK")
        return res.status(403).json({ error: result.error });
      return res.status(400).json({ error: result.error });
    }

    return res.json({ success: true });
  },
);

router.put("/me/money", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const { money } = req.body;

  if (money === undefined || typeof money !== "number" || money < 0) {
    return res.status(400).json({ error: "INVALID_MONEY_AMOUNT" });
  }

  const result = await updateMoney(userId, money);

  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") return res.status(404).json({ error: result.error });
    if (result.error === "INVALID_AMOUNT") return res.status(400).json({ error: result.error });
    return res.status(500).json({ error: result.error });
  }

  return res.json({ money: result.value });
});

router.put("/me/boosters/:boosterId", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const boosterId = req.params.boosterId as string;

  const result = await addBooster(userId, boosterId);

  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") return res.status(404).json({ error: result.error });
    if (result.error === "BOOSTER_NOT_FOUND") return res.status(404).json({ error: result.error });
    if (result.error === "NOT_ENOUGH_MONEY") return res.status(400).json({ error: result.error });
    return res.status(500).json({ error: result.error });
  }

  return res.status(200).json({ success: true });
});


export default router;
