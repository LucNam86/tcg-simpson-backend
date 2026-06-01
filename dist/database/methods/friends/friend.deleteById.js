"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFriendById = void 0;
const Result_1 = require("../../../shared/Result");
const user_model_1 = require("../../models/user.model");
const deleteFriendById = async (userId, friendId) => {
    try {
        await user_model_1.UserModel.findByIdAndUpdate(userId, {
            $pull: { friends: friendId },
        });
        await user_model_1.UserModel.findByIdAndUpdate(friendId, {
            $pull: { friends: userId },
        });
        return (0, Result_1.ok)(true);
    }
    catch (error) {
        console.error("Erreur BDD deleteFriendById:", error);
        return (0, Result_1.err)("DATABASE_ERROR");
    }
};
exports.deleteFriendById = deleteFriendById;
//# sourceMappingURL=friend.deleteById.js.map