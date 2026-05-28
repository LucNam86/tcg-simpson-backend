import { z } from "zod";

export const PublicDeckBasicSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  cards: z.array(z.string()),
});

export const CreateDeckSchema = z.object({
  name: z.string().min(1),
  cards: z.array(z.string()).length(10),
});

export const UpdateDeckSchema = z.object({
  name: z.string().min(1).optional(),
  cards: z.array(z.string()).length(10).optional(),
}).refine((data) => data.name !== undefined || data.cards !== undefined, {
  message: "At least one field must be provided",
});

export type PublicDeckBasic = z.infer<typeof PublicDeckBasicSchema>;
export type CreateDeckInput = z.infer<typeof CreateDeckSchema>;
export type UpdateDeckInput = z.infer<typeof UpdateDeckSchema>;