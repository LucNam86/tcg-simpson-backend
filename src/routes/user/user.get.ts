// routes/user.ts
import { Router } from "express";
import {
    fetchUserById,fetchUserCollection,fetchUserBoosters
} from "@services/user";
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

// router.get("/me/collection", jwtMiddleware, async (req: AuthRequest, res) => {
//   const userId = req.user?.id;
//   if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

//   const result = await fetchUserCollection(userId);
//   if (!result.ok) return res.status(404).json({ error: result.error });

//   return res.json(result.value);
// });


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

  const { rarity, type, serie } = req.query;

  const result = await fetchUserCollection(userId , {
    rarity: rarity as string,
    type: type as string,
    serie: serie as string,
  });

  if (!result.ok) return res.status(404).json({ error: result.error });

  return res.json(result.value);
});


export default router;
