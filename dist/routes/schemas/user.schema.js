"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicUserSchema = exports.PublicUserFullSchema = exports.PublicDeckSchema = exports.PublicFriendArraySchema = exports.PublicFriendSchema = exports.UserBoosterArraySchema = exports.UserBoosterSchema = exports.UpdateUserSchema = exports.ConnectSchema = exports.RegisterSchema = void 0;
// shared/schemas/user.schemas.ts
const zod_1 = require("zod");
const card_schema_1 = require("../schemas/card.schema");
const booster_schema_1 = require("../schemas/booster.schema");
exports.RegisterSchema = zod_1.z.object({
    pseudo: zod_1.z.string().min(3).max(20),
    email: zod_1.z.email(),
    password: zod_1.z.string().min(8).max(72),
});
exports.ConnectSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(8).max(72),
});
exports.UpdateUserSchema = zod_1.z
    .object({
    pseudo: zod_1.z.string().min(3).max(20).optional(),
    password: zod_1.z.string().min(8).max(72).optional(),
    avatar: zod_1.z.string().startsWith("/avatars/avatar-").endsWith(".webp").optional(),
    money: zod_1.z.number().nonnegative().optional(),
})
    .strict();
exports.UserBoosterSchema = zod_1.z.object({
    booster: booster_schema_1.PublicBoosterSchema,
    number: zod_1.z.number(),
});
exports.UserBoosterArraySchema = zod_1.z.array(exports.UserBoosterSchema);
exports.PublicFriendSchema = zod_1.z.object({
    pseudo: zod_1.z.string(),
    avatar: zod_1.z.string(),
});
exports.PublicFriendArraySchema = zod_1.z.array(exports.PublicFriendSchema);
exports.PublicDeckSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    id: zod_1.z.string().optional(),
    name: zod_1.z.string(),
    cards: zod_1.z.array(zod_1.z.string()).or(zod_1.z.array(card_schema_1.PublicCardSchema)),
    isActive: zod_1.z.boolean().default(false),
    user: zod_1.z.string(),
});
exports.PublicUserFullSchema = zod_1.z.object({
    id: zod_1.z.string(),
    pseudo: zod_1.z.string(),
    email: zod_1.z.string(),
    avatar: zod_1.z.string(),
    money: zod_1.z.number(),
    countdownEnds: zod_1.z.date(),
    myCollection: zod_1.z.array(card_schema_1.PublicCardSchema),
    boosters: zod_1.z.array(exports.UserBoosterSchema),
    decks: zod_1.z.array(zod_1.z.string()).or(zod_1.z.array(exports.PublicDeckSchema)),
    darkMode: zod_1.z.boolean(),
    friends: zod_1.z.array(exports.PublicFriendSchema).default([]),
});
exports.PublicUserSchema = zod_1.z.object({
    id: zod_1.z.string(),
    pseudo: zod_1.z.string(),
    email: zod_1.z.string(),
    avatar: zod_1.z.string(),
    money: zod_1.z.number(),
    countdownEnds: zod_1.z.date(),
    darkMode: zod_1.z.boolean(),
});
//# sourceMappingURL=user.schema.js.map