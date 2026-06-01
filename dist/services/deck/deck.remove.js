"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserDeck = removeUserDeck;
const Result_1 = require("../../shared/Result");
const deck_1 = require("../../database/methods/deck");
async function removeUserDeck(userId, deckId) {
    const result = await (0, deck_1.deleteDeck)(userId, deckId);
    if (!result.ok) {
        if (result.error === "DECK_NOT_FOUND")
            return (0, Result_1.err)("DECK_NOT_FOUND");
        if (result.error === "UNAUTHORIZED_DECK")
            return (0, Result_1.err)("UNAUTHORIZED_DECK");
        return (0, Result_1.err)("DATABASE_ERROR");
    }
    return (0, Result_1.ok)(undefined);
}
//# sourceMappingURL=deck.remove.js.map