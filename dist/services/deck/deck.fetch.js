"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserDecks = fetchUserDecks;
const deck_mapper_1 = require("../../database/mapper/deck.mapper");
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
async function fetchUserDecks(userId) {
    const result = await (0, user_1.findByIdWithDecks)(userId);
    if (!result.ok) {
        if (result.error === "USER_NOT_FOUND")
            return (0, Result_1.err)("USER_NOT_FOUND");
        return (0, Result_1.err)("DATABASE_ERROR");
    }
    return (0, Result_1.ok)(result.value.decks.map(deck_mapper_1.mapDeck));
}
//# sourceMappingURL=deck.fetch.js.map