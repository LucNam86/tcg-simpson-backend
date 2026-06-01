"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const user_updateById_1 = require("../../../database/methods/user/update/user.updateById");
const user_model_1 = require("../../../database/models/user.model");
let mongoServer;
const validUser = {
    pseudo: "TestUser",
    email: "test@example.com",
    passwordHash: "hashed-password",
    avatar: "/avatars/avatar-1.webp",
    money: 100,
    countdownEnds: new Date(),
    myCollection: [],
    boosters: [],
    decks: [],
    darkMode: false,
};
(0, globals_1.beforeAll)(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri() + "updateUser");
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.beforeEach)(async () => {
    await user_model_1.UserModel.deleteMany({});
});
(0, globals_1.describe)("updateById (user.updateById.ts)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait mettre à jour le pseudo et retourner le document mis à jour", async () => {
            const created = await user_model_1.UserModel.create(validUser);
            const result = await (0, user_updateById_1.updateById)(created._id.toString(), { pseudo: "UpdatedUser" });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value?.pseudo).toBe("UpdatedUser");
            }
        });
        (0, globals_1.it)("devrait mettre à jour l'avatar", async () => {
            const created = await user_model_1.UserModel.create(validUser);
            const result = await (0, user_updateById_1.updateById)(created._id.toString(), {
                avatar: "/avatars/avatar-5.webp",
            });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value?.avatar).toBe("/avatars/avatar-5.webp");
            }
        });
        (0, globals_1.it)("devrait mettre à jour la money", async () => {
            const created = await user_model_1.UserModel.create(validUser);
            const result = await (0, user_updateById_1.updateById)(created._id.toString(), { money: 500 });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value?.money).toBe(500);
            }
        });
        (0, globals_1.it)("devrait retourner null si l'id n'existe pas", async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId().toString();
            const result = await (0, user_updateById_1.updateById)(fakeId, { pseudo: "UpdatedUser" });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toBeNull();
            }
        });
        (0, globals_1.it)("devrait persister les modifications en BDD", async () => {
            const created = await user_model_1.UserModel.create(validUser);
            await (0, user_updateById_1.updateById)(created._id.toString(), { pseudo: "UpdatedUser" });
            const found = await user_model_1.UserModel.findById(created._id);
            (0, globals_1.expect)(found?.pseudo).toBe("UpdatedUser");
        });
        (0, globals_1.it)("devrait retourner le document APRÈS modification (returnDocument after)", async () => {
            const created = await user_model_1.UserModel.create(validUser);
            const result = await (0, user_updateById_1.updateById)(created._id.toString(), { money: 999 });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value?.money).toBe(999);
            }
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner PSEUDO_ALREADY_USED en cas de doublon", async () => {
            await user_model_1.UserModel.create(validUser);
            const second = await user_model_1.UserModel.create({
                ...validUser,
                email: "second@example.com",
                pseudo: "SecondUser",
            });
            const result = await (0, user_updateById_1.updateById)(second._id.toString(), {
                pseudo: "TestUser", // pseudo déjà pris
            });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("PSEUDO_ALREADY_USED");
            }
        });
    });
});
//# sourceMappingURL=updateById.database.test.js.map