// routes/user.ts
import { Router } from "express";
import {
  fetchUserById,
  fetchPseudosAutocomplete,
} from "@services/profile/index";
import {fetchUserBoosters} from "@services/booster"
import {fetchUserDecks} from "@services/deck";
import {fetchUserFriends} from "@services/friends"
import {fetchUserCollection} from "@services/card"
import { jwtMiddleware, AuthRequest } from "@middleware/jwt.middleware";

const router = Router();

router.get("/me/profile", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const result = await fetchUserById(userId);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.json(result.value);
});

router.get("/me/boosters", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const result = await fetchUserBoosters(userId);
  if (!result.ok) return res.status(404).json({ error: result.error });

  return res.json(result.value);
});


router.get("/me/collection", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const { q, rarity, type, serie } = req.query;

  const result = await fetchUserCollection(userId, {
    q: q as string,
    rarity: rarity as string[],
    type: type as string[],
    serie: serie as string[],
  });

  if (!result.ok) return res.status(404).json({ error: result.error });

  return res.json(result.value);
});

router.get("/me/friends", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const result = await fetchUserFriends(userId);
  if (!result.ok) return res.status(404).json({ error: result.error });

  return res.json(result.value);
});

router.get("/search", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const { q } = req.query;
  if (!q || typeof q !== "string") return res.json([]);

  const result = await fetchPseudosAutocomplete(q, userId);
  if (!result.ok) return res.status(500).json({ error: result.error });

  return res.json(result.value);
});

router.get("/me/decks", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const result = await fetchUserDecks(userId);

  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") {
      return res.status(404).json({ error: result.error });
    }
    return res.status(500).json({ error: "SERVER_ERROR" });
  }

  return res.json(result.value);
});
export default router;
