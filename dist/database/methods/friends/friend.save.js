"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFriend = void 0;
// database/methods/user/user.addFriendById.ts
const Result_1 = require("../../../shared/Result");
const user_model_1 = require("../../models/user.model");
const saveFriend = async (userId, friendId) => {
    try {
        const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } }, { new: true });
        if (!updatedUser)
            return (0, Result_1.err)("USER_NOT_FOUND");
        await user_model_1.UserModel.findByIdAndUpdate(friendId, {
            $addToSet: { friends: userId },
        });
        return (0, Result_1.ok)(true);
    }
    catch (e) {
        return (0, Result_1.err)("Erreur lors de l'ajout de l'ami en base de données");
    }
};
exports.saveFriend = saveFriend;
//# sourceMappingURL=friend.save.js.map