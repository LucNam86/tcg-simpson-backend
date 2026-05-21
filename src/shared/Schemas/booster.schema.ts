import { z } from 'zod';


export const PublicBoosterSchema = z.object({
  name: z.string(),
  price : z.number(),
  slug : z.string(),
  quantity : z.number(),
  cards : z.array(z.string()),
});

export type PublicBoosterSchema = z.infer<typeof PublicBoosterSchema>;
