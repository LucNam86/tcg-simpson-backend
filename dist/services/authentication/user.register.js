"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
// services/user.service.ts
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const booster_1 = require("../../database/methods/booster");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_mapper_1 = require("../../database/mapper/user.mapper");
const env_1 = require("../../config/env");
async function registerUser(input) {
    const existingEmail = await (0, user_1.findByEmail)(input.email);
    if (existingEmail.ok && existingEmail.value)
        return (0, Result_1.err)("EMAIL_TAKEN");
    const existingPseudo = await (0, user_1.findByPseudo)(input.pseudo);
    if (existingPseudo.ok && existingPseudo.value)
        return (0, Result_1.err)("PSEUDO_TAKEN");
    if (!existingEmail.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!existingPseudo.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    const passwordHash = await bcrypt_1.default.hash(input.password, env_1.env.BCRYPT_SALT_ROUNDS);
    const boosters = await (0, booster_1.find)();
    if (!boosters.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    const AVATAR_COUNT = 13;
    const randomIndex = Math.floor(Math.random() * AVATAR_COUNT) + 1;
    const avatar = `/avatars/avatar-${randomIndex}.webp`;
    const user = {
        pseudo: input.pseudo,
        email: input.email.toLowerCase(),
        passwordHash,
        avatar,
        money: 100,
        countdownEnds: new Date(),
        myCollection: [],
        boosters: boosters.value.map((booster) => ({
            booster: booster._id,
            number: 1,
        })),
        decks: [],
        darkMode: false,
    };
    const saved = await (0, user_1.save)(user);
    if (!saved.ok)
        return (0, Result_1.err)("USER_CREATION_FAILED");
    const savedUser = await (0, user_1.findById)(saved.value);
    if (!savedUser.ok || !savedUser.value)
        return (0, Result_1.err)("USER_CREATION_FAILED");
    return (0, Result_1.ok)((0, user_mapper_1.mapUserPublic)(savedUser.value));
}
;
//# sourceMappingURL=user.register.js.map