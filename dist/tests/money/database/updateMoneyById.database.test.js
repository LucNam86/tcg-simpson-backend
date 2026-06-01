"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const user_updateMoneyById_1 = require("../../../database/methods/user/update/user.updateMoneyById");
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
    await mongoose_1.default.connect(mongoServer.getUri() + "updateMoneyById");
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.beforeEach)(async () => {
    await user_model_1.UserModel.deleteMany({});
});
(0, globals_1.describe)("updateMoneyById (user.updateMoneyById.ts)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait mettre à jour la money et retourner le nouveau solde", async () => {
            const created = await user_model_1.UserModel.create(validUser);
            const result = await (0, user_updateMoneyById_1.updateMoneyById)(created._id.toString(), 200);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok)
                (0, globals_1.expect)(result.value).toBe(200);
        });
        (0, globals_1.it)("devrait persister la mise à jour en BDD", async () => {
            const created = await user_model_1.UserModel.create(validUser);
            await (0, user_updateMoneyById_1.updateMoneyById)(created._id.toString(), 500);
            const updated = await user_model_1.UserModel.findById(created._id);
            (0, globals_1.expect)(updated?.money).toBe(500);
        });
        (0, globals_1.it)("devrait accepter une valeur de 0", async () => {
            const created = await user_model_1.UserModel.create(validUser);
            const result = await (0, user_updateMoneyById_1.updateMoneyById)(created._id.toString(), 0);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok)
                (0, globals_1.expect)(result.value).toBe(0);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si l'utilisateur n'existe pas", async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId().toString();
            const result = await (0, user_updateMoneyById_1.updateMoneyById)(fakeId, 100);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si l'id est invalide", async () => {
            const result = await (0, user_updateMoneyById_1.updateMoneyById)("invalid-id", 100);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=updateMoneyById.database.test.js.map