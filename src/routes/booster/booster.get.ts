
 import { Router } from "express";
 import {
   fetchBoosters
 } from "@services/booster/booster.fetch";
 import { jwtMiddleware, AuthRequest } from "@middleware/jwt.middleware";

 const router = Router();

 router.get("/", jwtMiddleware, async (req: AuthRequest, res) => {
     const userId = req.user?.id;
     console.log("User ID from JWT:", userId); // Debug log to check the user ID

     if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const result = await fetchBoosters();

     if (!result.ok) {
         return res.status(404).json({ error: result.error });
     }

   return res.json(result.value);
});

export default router;