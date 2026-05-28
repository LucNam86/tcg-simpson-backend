import { Router } from "express";
import { RegisterSchema, ConnectSchema } from "@routes/schemas/user.schema";
import { registerUser, connectUser } from "@services/authentication";
import { addUserFriend } from "@services/friends/friends.add";
import { addDeck } from "@services/deck";
import { CreateDeckSchema } from "@routes/schemas/deck.schema";
import {
  signToken,
  jwtMiddleware,
  AuthRequest,
} from "@middleware/jwt.middleware";
import { openBooster } from "@services/booster";
import { sellCollectionCards } from "@services/card";
import { addMoney } from "@services/profile/profile.addMoney";

const router = Router();

router.post("/register", async (req, res) => {
  console.log("REGISTER ROUTE HIT", req.body);

  const body = RegisterSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "EMAIL_INVALID" });

  const result = await registerUser(body.data);
  if (!result.ok) {
    if (result.error === "EMAIL_TAKEN")
      return res.status(409).json({ error: result.error });
    if (result.error === "PSEUDO_TAKEN")
      return res.status(409).json({ error: result.error });

    return res.status(400).json({ error: result.error });
  }

  const token = signToken({ id: result.value.id });
  const { id, ...userWithoutId } = result.value;
  return res.status(201).json({ token, ...userWithoutId });
});

router.post("/connect", async (req, res) => {
  const body = ConnectSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "INPUT_INVALID" });

  const result = await connectUser(body.data);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  const token = signToken({ id: result.value.id });
  return res.status(201).json({ token, ...result.value });
});

router.post("/me/friends", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const { pseudo } = req.body;
  if (!pseudo) return res.status(400).json({ error: "PSEUDO_REQUIRED" });

  const result = await addUserFriend(userId, pseudo);
  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND")
      return res.status(404).json({ error: result.error });
    if (result.error === "CANT_ADD_SELF")
      return res.status(400).json({ error: result.error });
    return res.status(500).json({ error: result.error });
  }

  return res.json({ success: true });
});

router.post("/me/decks", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const body = CreateDeckSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "INPUT_INVALID" });

  const result = await addDeck({ userId, name: body.data.name, cards: body.data.cards });

  if (!result.ok) {
    switch (result.error) {
      case "USER_NOT_FOUND":
        return res.status(404).json({ error: result.error });
      case "MAX_DECKS_REACHED":
        return res.status(400).json({ error: result.error });
      default:
        return res.status(500).json({ error: "SERVER_ERROR" });
    }
  }

  return res.status(201).json(result.value);
});

// routes/booster.route.ts
router.post(
  "/me/boosters/:boosterId/open",
  jwtMiddleware,
  async (req: AuthRequest, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const boosterId = req.params.boosterId as string;

    const result = await openBooster(userId, boosterId);
    if (!result.ok) return res.status(404).json({ error: result.error });

    return res.json({ cards: result.value });
  },
);

router.post(
  "/me/collection/sell",
  jwtMiddleware,
  async (req: AuthRequest, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const { cardId, count } = req.body;
    if (!cardId || !count || typeof count !== "number" || count <= 0) {
      return res.status(400).json({ error: "INPUT_INVALID" });
    }

    const result = await sellCollectionCards(userId, cardId, count);

    if (!result.ok) {
      switch (result.error) {
        case "USER_NOT_FOUND":
          return res.status(404).json({ error: "USER_NOT_FOUND" });
        case "INSUFFICIENT_QUANTITY":
          return res.status(400).json({ error: "INSUFFICIENT_QUANTITY" });
        case "DATABASE_ERROR":
        case "SERVER_ERROR":
        default:
          return res.status(500).json({ error: "SERVER_ERROR" });
      }
    }

    // On renvoie le succès ainsi que les donuts calculés par le serveur
    return res.json({ success: true, earnedDonuts: result.value.earnedDonuts, money: result.value.money });
  },
);

const MONEY_PACKS: Record<string, number> = {
  "pack-50": 50,
  "pack-100": 100,
  "pack-200": 200,
  "pack-500": 500,
  "pack-1000": 1000,
};

router.post("/me/money", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const { packId } = req.body;
  if (!packId || !MONEY_PACKS[packId]) {
    return res.status(400).json({ error: "INVALID_PACK" });
  }

  const amount = MONEY_PACKS[packId];
  const result = await addMoney(userId, amount);

  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") return res.status(404).json({ error: result.error });
    return res.status(500).json({ error: result.error });
  }

  return res.json({ money: result.value });
});

export default router;
