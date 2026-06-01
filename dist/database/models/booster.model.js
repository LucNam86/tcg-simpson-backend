"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoosterModel = void 0;
const mongoose_1 = require("mongoose");
const boosterSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    slug: { type: String, required: true },
    quantity: { type: Number, required: true },
    cards: { type: [mongoose_1.Schema.Types.ObjectId], ref: "Card", required: true, default: [] },
    serie: { type: mongoose_1.Schema.Types.ObjectId, ref: "Serie", required: true },
    probabilities: {
        type: [{
                rarity: { type: String, enum: ["Common", "Rare", "Legendary"], required: true },
                value: { type: Number, required: true },
            }],
        required: true,
        default: [
            { rarity: "Common", value: 70 },
            { rarity: "Rare", value: 25 },
            { rarity: "Legendary", value: 5 },
        ],
    },
}, { toObject: { virtuals: true }, toJSON: { virtuals: true } });
exports.BoosterModel = (0, mongoose_1.model)("Booster", boosterSchema);
//# sourceMappingURL=booster.model.js.map