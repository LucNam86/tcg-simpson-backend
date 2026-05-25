import { Router } from "express";
import { jwtMiddleware, AuthRequest } from "@middleware/jwt.middleware";
import { removeUserFriend } from "@services/user";

const router = Router();

router.delete(
  "/me/friends/:friendId",
  jwtMiddleware,
  async (req: AuthRequest, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const { friendId } = req.params;

    if (!friendId || typeof friendId !== "string") {
      return res.status(400).json({ error: "INVALID_OR_MISSING_FRIEND_ID" });
    }

    const result = await removeUserFriend(userId, friendId);

    if (!result.ok) {
      return res.status(500).json({ error: result.error });
    }

    return res.json({ success: true });
  },
);

export default router;
