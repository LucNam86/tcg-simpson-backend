"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCountdown = updateCountdown;
const Result_1 = require("../../shared/Result");
const user_updateCountdownEnds_1 = require("../../database/methods/user/update/user.updateCountdownEnds");
const user_1 = require("../../database/methods/user");
async function updateCountdown(userId, countdownEnds) {
    const userResult = await (0, user_1.findById)(userId);
    if (!userResult.ok)
        return (0, Result_1.err)("DATABASE_ERRORE");
    if (!userResult.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    const result = await (0, user_updateCountdownEnds_1.updateCountdownEndsById)(userId, countdownEnds);
    if (!result.ok) {
        if (result.error === "USER_NOT_FOUND")
            return (0, Result_1.err)("USER_NOT_FOUND");
        return (0, Result_1.err)("DATABASE_ERRORE");
    }
    return (0, Result_1.ok)(result.value);
}
//# sourceMappingURL=profile.updateCountdownEnds.js.map