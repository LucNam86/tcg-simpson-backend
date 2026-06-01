"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByIdWithDecks = findByIdWithDecks;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
async function findByIdWithDecks(userId) {
    try {
        const user = await user_model_1.UserModel.findById(userId)
            .populate({
            path: "decks",
            populate: {
                path: "cards",
                populate: [
                    { path: "family" },
                    { path: "affinity" },
                    { path: "serie.id_serie" },
                ],
            },
        })
            .lean();
        if (!user)
            return (0, Result_1.err)("USER_NOT_FOUND");
        return (0, Result_1.ok)(user);
    }
    catch (e) {
        console.error("findByIdWithDecks error:", e);
        return (0, Result_1.err)("Erreur lors de la récupération des decks");
    }
}
//# sourceMappingURL=user.findByIdWithDecks.js.map