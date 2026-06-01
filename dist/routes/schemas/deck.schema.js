"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeckSchema = exports.CreateDeckSchema = exports.PublicDeckBasicSchema = void 0;
const zod_1 = require("zod");
exports.PublicDeckBasicSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    isActive: zod_1.z.boolean(),
    cards: zod_1.z.array(zod_1.z.string()),
});
exports.CreateDeckSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    cards: zod_1.z.array(zod_1.z.string()).length(10),
});
exports.UpdateDeckSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    cards: zod_1.z.array(zod_1.z.string()).length(10).optional(),
}).refine((data) => data.name !== undefined || data.cards !== undefined, {
    message: "At least one field must be provided",
});
//# sourceMappingURL=deck.schema.js.map