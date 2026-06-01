"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateDeck = activateDeck;
const Result_1 = require("../../shared/Result");
const deck_updateActiveDeck_1 = require("../../database/methods/deck/deck.updateActiveDeck");
async function activateDeck(userId, deckId) {
    const result = await (0, deck_updateActiveDeck_1.updateActiveDeck)(userId, deckId);
    if (!result.ok) {
        if (result.error === "DECK_NOT_FOUND")
            return (0, Result_1.err)("DECK_NOT_FOUND");
        if (result.error === "UNAUTHORIZED_DECK")
            return (0, Result_1.err)("UNAUTHORIZED_DECK");
        return (0, Result_1.err)("DATABASE_ERROR");
    }
    return (0, Result_1.ok)(undefined);
}
//# sourceMappingURL=deck.isActive.js.map