"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateById = updateById;
const Result_1 = require("../../../shared/Result");
const deck_model_1 = require("../../models/deck.model");
const mongoose_1 = require("mongoose");
async function updateById(userId, deckId, input) {
    try {
        const deck = await deck_model_1.DeckModel.findById(deckId);
        if (!deck)
            return (0, Result_1.err)("DECK_NOT_FOUND");
        if (deck.user.toString() !== userId)
            return (0, Result_1.err)("UNAUTHORIZED_DECK");
        if (input.name)
            deck.name = input.name;
        if (input.cards) {
            if (input.cards.length !== 10)
                return (0, Result_1.err)("INVALID_CARD_COUNT");
            deck.cards = input.cards.map((id) => new mongoose_1.Types.ObjectId(id));
        }
        await deck.save();
        return (0, Result_1.ok)(deck);
    }
    catch (error) {
        console.error("Erreur updateDeck:", error);
        return (0, Result_1.err)("DATABASE_ERROR");
    }
}
//# sourceMappingURL=deck.updateById.js.map