import { Router } from 'express';

import {fetchCards} from "@services/card/card.fetch";
import { jwtMiddleware, AuthRequest } from "@middleware/jwt.middleware";

import '@database/models/card.model'; // ← 
import '@database/models/family.model';
import '@database/models/affinity.model';
import '@database/models/serie.model';

 const router = Router();

 router.get("/", jwtMiddleware, async (req: AuthRequest, res) => {
     const userId = req.user?.id;

     if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const result = await fetchCards();

     if (!result.ok) {
         return res.status(404).json({ error: result.error });
     }

   return res.json(result.value);
});

export default router;