"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMoney = addMoney;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const user_2 = require("../../database/methods/user");
async function addMoney(userId, amount) {
    const userResult = await (0, user_2.findById)(userId);
    if (!userResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!userResult.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    const newMoney = (userResult.value.money || 0) + amount;
    const result = await (0, user_1.updateMoneyById)(userId, newMoney);
    if (!result.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    return (0, Result_1.ok)(result.value);
}
//# sourceMappingURL=profile.addMoney.js.map