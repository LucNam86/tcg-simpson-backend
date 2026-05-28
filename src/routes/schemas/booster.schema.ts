import { z } from 'zod';
import {PublicCardSchema} from "@routes/schemas/card.schema";

export const PublicBoosterSchema = z.object({
  id: z.string(),
  name: z.string(),
  price : z.number(),
  slug : z.string(),
  quantity : z.number(),
  cards : z.array(PublicCardSchema),
  serie: z.object({
    id: z.string(),
    name: z.string(),
  }),
  probabilities: z.array(z.object({
    rarity: z.enum(["Common", "Rare", "Legendary"]),
    value: z.number(),
  }))
  
});

export type PublicBooster= z.infer<typeof PublicBoosterSchema>;

export const PublicBoosterArraySchema = z.array(PublicBoosterSchema);

export type PublicBoosterArray = z.infer<typeof PublicBoosterArraySchema>;
