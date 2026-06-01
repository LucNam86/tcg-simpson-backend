"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateActiveDeck = updateActiveDeck;
const Result_1 = require("../../../shared/Result");
const deck_model_1 = require("../../models/deck.model");
const mongoose_1 = require("mongoose");
async function updateActiveDeck(userId, deckId) {
    try {
        const deck = await deck_model_1.DeckModel.findById(deckId);
        if (!deck)
            return (0, Result_1.err)("DECK_NOT_FOUND");
        if (deck.user.toString() !== userId)
            return (0, Result_1.err)("UNAUTHORIZED_DECK");
        await deck_model_1.DeckModel.updateMany({ user: new mongoose_1.Types.ObjectId(userId) }, { isActive: false });
        deck.isActive = true;
        await deck.save();
        return (0, Result_1.ok)(undefined);
    }
    catch (error) {
        console.error("Erreur updateActiveDeck:", error);
        return (0, Result_1.err)("DATABASE_ERROR");
    }
}
//# sourceMappingURL=deck.updateActiveDeck.js.map