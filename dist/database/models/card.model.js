"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardModel = void 0;
const mongoose_1 = require("mongoose");
const cardSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    ATK: { type: Number, required: true },
    PV: { type: Number, required: true },
    description: { type: String, required: true },
    family: { type: mongoose_1.Schema.Types.ObjectId, ref: "Family", required: true },
    affinity: { type: mongoose_1.Schema.Types.ObjectId, ref: "Affinity", required: true },
    slug: { type: String, required: true, unique: true },
    serie: {
        id_serie: { type: mongoose_1.Schema.Types.ObjectId, ref: "Serie", required: true },
        position: { type: Number, required: true },
    },
    rarity: { type: String, required: true },
    type: {
        type: String,
        enum: ["Personnage", "Objet", "Terrain"],
        required: true,
    },
});
exports.CardModel = (0, mongoose_1.model)("Card", cardSchema);
//# sourceMappingURL=card.model.js.map