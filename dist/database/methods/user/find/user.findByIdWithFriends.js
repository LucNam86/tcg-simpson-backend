"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByIdWithFriends = findByIdWithFriends;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
async function findByIdWithFriends(userId) {
    try {
        const user = await user_model_1.UserModel.findById(userId)
            .populate("friends", "_id pseudo avatar myCollection")
            .lean();
        if (!user)
            return (0, Result_1.err)("USER_NOT_FOUND");
        return (0, Result_1.ok)(user.friends);
    }
    catch (e) {
        console.error("[findByIdWithFriends] Error:", e);
        return (0, Result_1.err)("Erreur lors de la récupération de la liste d'amis");
    }
}
//# sourceMappingURL=user.findByIdWithFriends.js.map