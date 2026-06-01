"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const user_save_1 = require("../../database/methods/user/save/user.save");
const user_model_1 = require("../../database/models/user.model");
let mongoServer;
(0, globals_1.beforeAll)(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri() + "saveUser");
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.beforeEach)(async () => {
    await user_model_1.UserModel.deleteMany({});
});
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
(0, globals_1.describe)("save (user.save.ts)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait créer un utilisateur et retourner son id", async () => {
            const result = await (0, user_save_1.save)(validUser);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(typeof result.value).toBe("string");
                (0, globals_1.expect)(result.value).toHaveLength(24); // ObjectId MongoDB
            }
        });
        (0, globals_1.it)("devrait persister l'utilisateur en BDD", async () => {
            const result = await (0, user_save_1.save)(validUser);
            if (result.ok) {
                const found = await user_model_1.UserModel.findById(result.value);
                (0, globals_1.expect)(found).not.toBeNull();
                (0, globals_1.expect)(found?.pseudo).toBe("TestUser");
                (0, globals_1.expect)(found?.email).toBe("test@example.com");
                (0, globals_1.expect)(found?.money).toBe(100);
            }
        });
        (0, globals_1.it)("devrait retourner un id différent pour chaque utilisateur", async () => {
            const result1 = await (0, user_save_1.save)({ ...validUser, email: "user1@example.com", pseudo: "User1" });
            const result2 = await (0, user_save_1.save)({ ...validUser, email: "user2@example.com", pseudo: "User2" });
            (0, globals_1.expect)(result1.ok).toBe(true);
            (0, globals_1.expect)(result2.ok).toBe(true);
            if (result1.ok && result2.ok) {
                (0, globals_1.expect)(result1.value).not.toBe(result2.value);
            }
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner une erreur si un champ requis est manquant", async () => {
            const result = await (0, user_save_1.save)({ email: "test@example.com" }); // pseudo manquant
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("Erreur lors de la sauvegarde");
            }
        });
        (0, globals_1.it)("devrait retourner une erreur si l'email est dupliqué", async () => {
            await (0, user_save_1.save)(validUser);
            const result = await (0, user_save_1.save)(validUser); // même email
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("Erreur lors de la sauvegarde");
            }
        });
    });
});
//# sourceMappingURL=save.database.test.js.map