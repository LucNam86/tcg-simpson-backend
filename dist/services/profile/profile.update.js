"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = updateUser;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
async function updateUser(id, input) {
    const updateData = {};
    if (input.pseudo)
        updateData.pseudo = input.pseudo;
    if (input.password) {
        updateData.passwordHash = await bcrypt_1.default.hash(input.password, env_1.env.BCRYPT_SALT_ROUNDS);
    }
    if (input.money !== undefined)
        updateData.money = input.money;
    if (input.avatar)
        updateData.avatar = input.avatar;
    const result = await (0, user_1.updateById)(id, updateData);
    if (!result.ok) {
        if (result.error === "PSEUDO_ALREADY_USED")
            return (0, Result_1.err)("PSEUDO_ALREADY_USED");
        return (0, Result_1.err)("DATABASE_ERROR");
    }
    if (!result.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    return (0, Result_1.ok)({
        pseudo: result.value.pseudo,
        money: result.value.money,
    });
}
//# sourceMappingURL=profile.update.js.map