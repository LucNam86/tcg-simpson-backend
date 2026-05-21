// shared/schemas/card.schema.ts
import { z } from 'zod';

const BonusSchema = z.object({
  ATK: z.number(),
  PV: z.number(),
});

export const PublicFamilySchema = z.object({
  id: z.string(),
  name: z.string(),
  desc: z.string(),
  bonus: BonusSchema,
});

export const PublicAffinitySchema = z.object({
  id: z.string(),
  name: z.string(),
  desc: z.string(),
  bonus: BonusSchema,
});

export const PublicSerieSchema = z.object({
  id: z.string(),
  name: z.string(),
});

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
    id_serie: PublicSerieSchema,
    position: z.number(),
  }),
  family: PublicFamilySchema,
  affinity: PublicAffinitySchema,
});

export type PublicCard = z.infer<typeof PublicCardSchema>;