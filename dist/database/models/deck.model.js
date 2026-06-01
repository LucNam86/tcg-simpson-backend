"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckModel = void 0;
const mongoose_1 = require("mongoose");
const deckSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    cards: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Card", required: true }],
    isActive: { type: Boolean, default: false },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
exports.DeckModel = (0, mongoose_1.model)("Deck", deckSchema);
//# sourceMappingURL=deck.model.js.map