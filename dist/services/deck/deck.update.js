"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeck = updateDeck;
const Result_1 = require("../../shared/Result");
const deck_updateById_1 = require("../../database/methods/deck/deck.updateById");
async function updateDeck(userId, deckId, input) {
    const result = await (0, deck_updateById_1.updateById)(userId, deckId, input);
    if (!result.ok) {
        if (result.error === "DECK_NOT_FOUND")
            return (0, Result_1.err)("DECK_NOT_FOUND");
        if (result.error === "UNAUTHORIZED_DECK")
            return (0, Result_1.err)("UNAUTHORIZED_DECK");
        if (result.error === "INVALID_CARD_COUNT")
            return (0, Result_1.err)("INVALID_CARD_COUNT");
        return (0, Result_1.err)("DATABASE_ERROR");
    }
    return (0, Result_1.ok)({
        id: result.value._id.toString(),
        name: result.value.name,
        isActive: result.value.isActive,
        cards: result.value.cards.map((card) => card.toString()),
    });
}
//# sourceMappingURL=deck.update.js.map