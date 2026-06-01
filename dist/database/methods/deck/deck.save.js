"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDeck = saveDeck;
const Result_1 = require("../../../shared/Result");
const deck_model_1 = require("../../models/deck.model");
const user_model_1 = require("../../models/user.model");
const mongoose_1 = require("mongoose");
async function saveDeck(input) {
    try {
        const newDeck = new deck_model_1.DeckModel({
            name: input.name,
            cards: input.cards.map((id) => new mongoose_1.Types.ObjectId(id)),
            user: new mongoose_1.Types.ObjectId(input.userId),
            isActive: input.isActive,
        });
        await newDeck.save();
        await user_model_1.UserModel.updateOne({ _id: input.userId }, { $push: { decks: newDeck._id } });
        return (0, Result_1.ok)(newDeck);
    }
    catch (error) {
        console.error("Erreur saveDeck:", error);
        return (0, Result_1.err)("DATABASE_ERROR");
    }
}
//# sourceMappingURL=deck.save.js.map