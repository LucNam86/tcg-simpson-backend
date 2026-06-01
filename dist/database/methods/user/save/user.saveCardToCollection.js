"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCardsToCollection = void 0;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
const saveCardsToCollection = async (userId, boosterId, cards) => {
    try {
        const user = await user_model_1.UserModel.findById(userId);
        if (!user)
            return (0, Result_1.err)("USER_NOT_FOUND");
        const userBooster = user.boosters.find((b) => b.booster.toString() === boosterId);
        if (!userBooster)
            return (0, Result_1.err)("BOOSTER_NOT_FOUND");
        const update = userBooster.number === 1
            ? {
                $push: { myCollection: { $each: cards.map((card) => card._id.toString()) } },
                $pull: { boosters: { booster: boosterId } },
            }
            : {
                $push: { myCollection: { $each: cards.map((card) => card._id.toString()) } },
                $inc: { "boosters.$[booster].number": -1 },
            };
        const options = userBooster.number === 1
            ? {}
            : { arrayFilters: [{ "booster.booster": boosterId }] };
        await user_model_1.UserModel.findByIdAndUpdate(userId, update, options);
        return (0, Result_1.ok)(undefined);
    }
    catch (e) {
        console.error("saveCardsToCollection error:", e);
        return (0, Result_1.err)("Erreur lors de l'ajout des cartes à la collection");
    }
};
exports.saveCardsToCollection = saveCardsToCollection;
//# sourceMappingURL=user.saveCardToCollection.js.map