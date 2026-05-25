import { Router } from "express";
import { jwtMiddleware, AuthRequest } from "@middleware/jwt.middleware";
import { removeUserFriendByPseudo } from "@services/user"; // 🎯 Nom du service corrigé ici

const router = Router();

router.delete(
  "/me/friends/:pseudo",
  jwtMiddleware,
  async (req: AuthRequest, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const { pseudo } = req.params;

    if (!pseudo || typeof pseudo !== "string") {
      return res.status(400).json({ error: "INVALID_OR_MISSING_PSEUDO" });
    }

    const result = await removeUserFriendByPseudo(userId, pseudo);

    if (!result.ok) {
      if (result.error === "USER_NOT_FOUND")
        return res.status(404).json({ error: result.error });
      return res.status(500).json({ error: result.error });
    }

    return res.json({ success: true });
  },
);

export default router;