"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeck = deleteDeck;
const Result_1 = require("../../../shared/Result");
const deck_model_1 = require("../../models/deck.model");
const user_model_1 = require("../../models/user.model");
const mongoose_1 = require("mongoose");
async function deleteDeck(userId, deckId) {
    try {
        const deck = await deck_model_1.DeckModel.findById(deckId);
        if (!deck)
            return (0, Result_1.err)("DECK_NOT_FOUND");
        if (deck.user.toString() !== userId)
            return (0, Result_1.err)("UNAUTHORIZED_DECK");
        await deck_model_1.DeckModel.deleteOne({ _id: new mongoose_1.Types.ObjectId(deckId) });
        await user_model_1.UserModel.updateOne({ _id: new mongoose_1.Types.ObjectId(userId) }, { $pull: { decks: new mongoose_1.Types.ObjectId(deckId) } });
        return (0, Result_1.ok)(undefined);
    }
    catch (error) {
        console.error("Erreur BDD deleteDeck:", error);
        return (0, Result_1.err)("DATABASE_ERROR");
    }
}
//# sourceMappingURL=deck.delete.js.map