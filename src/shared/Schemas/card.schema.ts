import { z } from 'zod';

export const PublicCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  ATK: z.number(),
  PV: z.number(),
  description: z.string(),
  slug: z.string(),
  rarity: z.string(),
  type: z.enum(["Personnage", "Objet", "Terrain"]),
  serie: z.object({
    id_serie: z.string(),
    position: z.number(),
  }),
  family: z.string(),
  affinity: z.string(),
});

export type PublicCard = z.infer<typeof PublicCardSchema>;