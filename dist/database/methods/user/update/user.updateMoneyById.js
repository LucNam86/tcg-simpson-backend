"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMoneyById = updateMoneyById;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
async function updateMoneyById(userId, amount) {
    try {
        const user = await user_model_1.UserModel.findByIdAndUpdate(userId, { money: amount }, { new: true });
        if (!user)
            return (0, Result_1.err)("USER_NOT_FOUND");
        return (0, Result_1.ok)(user.money);
    }
    catch (e) {
        console.error("updateMoneyById error:", e);
        return (0, Result_1.err)("DATABASE_ERROR");
    }
}
//# sourceMappingURL=user.updateMoneyById.js.map