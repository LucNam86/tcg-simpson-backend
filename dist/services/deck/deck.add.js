"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDeck = addDeck;
const Result_1 = require("../../shared/Result");
const deck_1 = require("../../database/methods/deck");
const user_1 = require("../../database/methods/user");
async function addDeck(input) {
    if (input.cards.length !== 10)
        return (0, Result_1.err)("INVALID_CARD_COUNT");
    const userResult = await (0, user_1.findById)(input.userId);
    if (!userResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!userResult.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    if (userResult.value.decks.length >= 3)
        return (0, Result_1.err)("MAX_DECKS_REACHED");
    const result = await (0, deck_1.saveDeck)({
        userId: input.userId,
        name: input.name || "Mon Super Deck",
        cards: input.cards,
        isActive: userResult.value.decks.length === 0,
    });
    if (!result.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    return (0, Result_1.ok)({
        id: result.value._id.toString(),
        name: result.value.name,
        isActive: result.value.isActive,
        cards: input.cards,
    });
}
//# sourceMappingURL=deck.add.js.map