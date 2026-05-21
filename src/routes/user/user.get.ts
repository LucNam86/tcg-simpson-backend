// routes/user.ts
import { Router } from "express";
import {
    fetchUserById
} from "@services/user";
import { jwtMiddleware, AuthRequest } from "@middleware/jwt.middleware";

const router = Router();

router.get("/profile", jwtMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user?.id;
    console.log("User ID from JWT:", userId); // Debug log to check the user ID

    if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const result = await fetchUserById(userId);
    console.log("Result from fetchUserById:", result); // Debug log to check the service result

    if (!result.ok) {
        return res.status(404).json({ error: result.error });
    }

    return res.json(result.value);
});

export default router;
