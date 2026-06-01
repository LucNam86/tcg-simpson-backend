"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectUser = connectUser;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const user_mapper_1 = require("../../database/mapper/user.mapper");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function connectUser(input) {
    const existing = await (0, user_1.findByEmail)(input.email);
    if (!existing.ok || !existing.value)
        return (0, Result_1.err)("CREDENTIALS_UNKNOWN");
    const passwordMatch = bcrypt_1.default.compareSync(input.password, existing.value.passwordHash);
    if (!passwordMatch)
        return (0, Result_1.err)("WRONG_CREDENTIALS");
    return (0, Result_1.ok)((0, user_mapper_1.mapUserPublic)(existing.value));
}
//# sourceMappingURL=user.connect.js.map