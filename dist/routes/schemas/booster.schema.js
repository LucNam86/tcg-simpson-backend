"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicBoosterArraySchema = exports.PublicBoosterSchema = void 0;
const zod_1 = require("zod");
const card_schema_1 = require("../schemas/card.schema");
exports.PublicBoosterSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    price: zod_1.z.number(),
    slug: zod_1.z.string(),
    quantity: zod_1.z.number(),
    cards: zod_1.z.array(card_schema_1.PublicCardSchema),
    serie: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
    }),
    probabilities: zod_1.z.array(zod_1.z.object({
        rarity: zod_1.z.enum(["Common", "Rare", "Legendary"]),
        value: zod_1.z.number(),
    }))
});
exports.PublicBoosterArraySchema = zod_1.z.array(exports.PublicBoosterSchema);
//# sourceMappingURL=booster.schema.js.map