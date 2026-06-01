"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCountdownEndsById = updateCountdownEndsById;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
async function updateCountdownEndsById(userId, countdownEnds) {
    try {
        const user = await user_model_1.UserModel.findByIdAndUpdate(userId, { countdownEnds: countdownEnds }, { new: true });
        if (!user)
            return (0, Result_1.err)("USER_NOT_FOUND");
        return (0, Result_1.ok)(user.countdownEnds);
    }
    catch (e) {
        console.error("updateCountdownEndsById error:", e);
        return (0, Result_1.err)("DATABASE_ERROR");
    }
}
//# sourceMappingURL=user.updateCountdownEnds.js.map