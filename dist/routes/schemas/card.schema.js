"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicCardArraySchema = exports.PublicCardSchema = exports.PublicSerieSchema = exports.PublicAffinitySchema = exports.PublicFamilySchema = void 0;
// shared/schemas/card.schema.ts
const zod_1 = require("zod");
const BonusSchema = zod_1.z.object({
    ATK: zod_1.z.number(),
    PV: zod_1.z.number(),
});
exports.PublicFamilySchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    bonus: BonusSchema,
});
exports.PublicAffinitySchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    bonus: BonusSchema,
});
exports.PublicSerieSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.PublicCardSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    ATK: zod_1.z.number(),
    PV: zod_1.z.number(),
    description: zod_1.z.string(),
    slug: zod_1.z.string(),
    rarity: zod_1.z.string(),
    type: zod_1.z.enum(["Personnage", "Objet", "Terrain"]),
    serie: zod_1.z.object({
        id_serie: exports.PublicSerieSchema,
        position: zod_1.z.number(),
    }),
    family: exports.PublicFamilySchema,
    affinity: exports.PublicAffinitySchema,
});
exports.PublicCardArraySchema = zod_1.z.array(exports.PublicCardSchema);
//# sourceMappingURL=card.schema.js.map