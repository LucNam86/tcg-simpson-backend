// routes/user.ts
import { Router } from "express";
import {
    fetchUserById
} from "@services/user";
import { jwtMiddleware, AuthRequest } from "@middleware/jwt.middleware";

const router = Router();

router.get("/profile", jwtMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const result = await fetchUserById(userId);

    if (!result.ok) {
        return res.status(404).json({ error: result.error });
    }

    return res.json(result.value);
});

export default router;
