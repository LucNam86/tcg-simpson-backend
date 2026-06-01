"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDailyMoney = updateDailyMoney;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const user_updateMoneyById_1 = require("../../database/methods/user/update/user.updateMoneyById");
const user_2 = require("../../database/methods/user");
const DAILY_AMOUNT = 100;
const COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 heures
async function updateDailyMoney(userId) {
    const userResult = await (0, user_1.findById)(userId);
    if (!userResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!userResult.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    const user = userResult.value;
    // Vérification que le cooldown est terminé
    if (user.countdownEnds) {
        const countdownEnd = new Date(user.countdownEnds).getTime();
        const now = new Date().getTime();
        if (now < countdownEnd)
            return (0, Result_1.err)("NOT_READY");
    }
    const newMoney = (user.money || 0) + DAILY_AMOUNT;
    const countdownEnds = new Date(Date.now() + COOLDOWN_MS).toISOString();
    const moneyResult = await (0, user_updateMoneyById_1.updateMoneyById)(userId, newMoney);
    if (!moneyResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    const updateResult = await (0, user_2.updateById)(userId, { countdownEnds: new Date(countdownEnds) });
    if (!updateResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    return (0, Result_1.ok)({ money: newMoney, countdownEnds });
}
//# sourceMappingURL=profile.updateDailyMoney.js.map