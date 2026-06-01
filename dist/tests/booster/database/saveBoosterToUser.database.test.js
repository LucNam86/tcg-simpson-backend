"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const booster_save_1 = require("../../../database/methods/booster/booster.save");
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
    await mongoose_1.default.connect(mongoServer.getUri() + "saveBoosterToUser");
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.beforeEach)(async () => {
    await user_model_1.UserModel.deleteMany({});
});
(0, globals_1.describe)("saveBoosterToUser (booster.save.ts)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait ajouter un nouveau booster à l'utilisateur", async () => {
            const created = await user_model_1.UserModel.create(validUser);
            const boosterId = new mongoose_1.default.Types.ObjectId().toString();
            const result = await (0, booster_save_1.saveBoosterToUser)(created._id.toString(), boosterId);
            (0, globals_1.expect)(result.ok).toBe(true);
            const updated = await user_model_1.UserModel.findById(created._id);
            (0, globals_1.expect)(updated?.boosters).toHaveLength(1);
            (0, globals_1.expect)(updated?.boosters[0].number).toBe(1);
        });
        (0, globals_1.it)("devrait incrémenter le nombre si le booster existe déjà", async () => {
            const boosterId = new mongoose_1.default.Types.ObjectId();
            const created = await user_model_1.UserModel.create({
                ...validUser,
                boosters: [{ booster: boosterId, number: 1 }],
            });
            const result = await (0, booster_save_1.saveBoosterToUser)(created._id.toString(), boosterId.toString());
            (0, globals_1.expect)(result.ok).toBe(true);
            const updated = await user_model_1.UserModel.findById(created._id);
            (0, globals_1.expect)(updated?.boosters).toHaveLength(1);
            (0, globals_1.expect)(updated?.boosters[0].number).toBe(2);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si l'utilisateur n'existe pas", async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId().toString();
            const boosterId = new mongoose_1.default.Types.ObjectId().toString();
            const result = await (0, booster_save_1.saveBoosterToUser)(fakeId, boosterId);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si l'id est invalide", async () => {
            const result = await (0, booster_save_1.saveBoosterToUser)("invalid-id", "booster-id");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=saveBoosterToUser.database.test.js.map