import { Router } from 'express';

import {fetchCards} from "@services/card/card.fetch";
import { jwtMiddleware, AuthRequest } from "@middleware/jwt.middleware";

import '@database/models/card.model'; //
import '@database/models/family.model';
import '@database/models/affinity.model';
import '@database/models/serie.model';

 const router = Router();

router.get("/", jwtMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const { q, rarity, type, serie } = req.query;

  const toArray = (val: unknown): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val as string[];
    return [val as string];
  };

  const result = await fetchCards({
    q: q as string | undefined,
    rarity: toArray(rarity),
    type: toArray(type),
    serie: toArray(serie),
  });

  if (!result.ok) return res.status(404).json({ error: result.error });

  return res.json(result.value);
});

export default router;