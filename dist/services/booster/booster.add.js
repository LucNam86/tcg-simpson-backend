"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBooster = addBooster;
const Result_1 = require("../../shared/Result");
const booster_save_1 = require("../../database/methods/booster/booster.save");
const user_updateMoneyById_1 = require("../../database/methods/user/update/user.updateMoneyById");
const booster_findById_1 = require("../../database/methods/booster/booster.findById");
const user_1 = require("../../database/methods/user");
async function addBooster(userId, boosterId) {
    const userResult = await (0, user_1.findById)(userId);
    if (!userResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!userResult.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    const boosterResult = await (0, booster_findById_1.findById)(boosterId);
    if (!boosterResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!boosterResult.value)
        return (0, Result_1.err)("BOOSTER_NOT_FOUND");
    if (userResult.value.money < boosterResult.value.price)
        return (0, Result_1.err)("NOT_ENOUGH_MONEY");
    const saveResult = await (0, booster_save_1.saveBoosterToUser)(userId, boosterId);
    if (!saveResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    const newMoney = userResult.value.money - boosterResult.value.price;
    const moneyResult = await (0, user_updateMoneyById_1.updateMoneyById)(userId, newMoney);
    if (!moneyResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    return (0, Result_1.ok)({ money: moneyResult.value });
}
//# sourceMappingURL=booster.add.js.map