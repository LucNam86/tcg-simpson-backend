// shared/schemas/user.schemas.ts
import { z } from "zod";
import { PublicCardSchema } from "@shared/Schemas/card.schema";
import { PublicBoosterSchema } from "@shared/Schemas/booster.schema";

export const RegisterSchema = z.object({
  pseudo: z.string().min(3).max(20),
  email: z.email(),
  password: z.string().min(8).max(72),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ConnectSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
});

export type ConnectInput = z.infer<typeof ConnectSchema>;

export const UpdateUserSchema = z
  .object({
    pseudo: z.string().min(3).max(20).optional(),
    password: z.string().min(8).max(72).optional(),
    money: z.number().nonnegative().optional(),
  })
  .strict();

export type UpdateInput = z.infer<typeof UpdateUserSchema>;

export const UserBoosterSchema = z.object({
  booster: PublicBoosterSchema,
  number: z.number(),
});

export const UserBoosterArraySchema = z.array(UserBoosterSchema);
export type UserBoosters = z.infer<typeof UserBoosterArraySchema>;

export const PublicFriendSchema = z.object({
  pseudo: z.string(),
  avatar: z.string(),
});

export const PublicFriendArraySchema = z.array(PublicFriendSchema);
export type PublicFriend = z.infer<typeof PublicFriendSchema>;

export const PublicDeckSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  name: z.string(),
  cards: z.array(z.string()).or(z.array(PublicCardSchema)),
  isActive: z.boolean().default(false),
  user: z.string(),
});

export const PublicUserFullSchema = z.object({
  id: z.string(),
  pseudo: z.string(),
  email: z.string(),
  avatar: z.string(),
  money: z.number(),
  countdownEnds: z.date(),
  myCollection: z.array(PublicCardSchema),
  boosters: z.array(UserBoosterSchema),
  decks: z.array(z.string()).or(z.array(PublicDeckSchema)),
  darkMode: z.boolean(),
  friends: z.array(PublicFriendSchema).default([]),
});

export const PublicUserSchema = z.object({
  id: z.string(),
  pseudo: z.string(),
  email: z.string(),
  avatar: z.string(),
  money: z.number(),
  countdownEnds: z.date(),
  darkMode: z.boolean(),
});

export type PublicUser = z.infer<typeof PublicUserSchema>;
export type PublicUserFull = z.infer<typeof PublicUserFullSchema>;
