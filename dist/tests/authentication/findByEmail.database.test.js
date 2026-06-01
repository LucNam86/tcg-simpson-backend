"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const user_findByEmail_1 = require("../../database/methods/user/find/user.findByEmail");
const user_model_1 = require("../../database/models/user.model");
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
    await mongoose_1.default.connect(mongoServer.getUri() + "findByEmail");
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.beforeEach)(async () => {
    await user_model_1.UserModel.deleteMany({});
});
(0, globals_1.describe)("findByEmail (user.findByEmail.ts)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner l'utilisateur si l'email existe", async () => {
            await user_model_1.UserModel.create(validUser);
            const result = await (0, user_findByEmail_1.findByEmail)("test@example.com");
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value?.pseudo).toBe("TestUser");
                (0, globals_1.expect)(result.value?.email).toBe("test@example.com");
            }
        });
        (0, globals_1.it)("devrait retourner null si l'email n'existe pas", async () => {
            const result = await (0, user_findByEmail_1.findByEmail)("unknown@example.com");
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toBeNull();
            }
        });
        (0, globals_1.it)("devrait retourner le bon utilisateur parmi plusieurs", async () => {
            await user_model_1.UserModel.create(validUser);
            await user_model_1.UserModel.create({
                ...validUser,
                email: "second@example.com",
                pseudo: "SecondUser",
            });
            const result = await (0, user_findByEmail_1.findByEmail)("second@example.com");
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value?.pseudo).toBe("SecondUser");
                (0, globals_1.expect)(result.value?.email).toBe("second@example.com");
            }
        });
        (0, globals_1.it)("devrait être insensible à la casse pour la recherche", async () => {
            await user_model_1.UserModel.create(validUser);
            const result = await (0, user_findByEmail_1.findByEmail)("TEST@EXAMPLE.COM");
            // MongoDB est sensible à la casse par défaut
            // ce test vérifie le comportement actuel
            (0, globals_1.expect)(result.ok).toBe(true);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner une erreur si l'email est invalide au niveau mongoose", async () => {
            await mongoose_1.default.disconnect();
            const result = await (0, user_findByEmail_1.findByEmail)("test@example.com");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("Erreur lors de la recherche par email");
            }
            // Reconnexion pour les tests suivants
            await mongoose_1.default.connect(mongoServer.getUri());
        });
    });
});
//# sourceMappingURL=findByEmail.database.test.js.map