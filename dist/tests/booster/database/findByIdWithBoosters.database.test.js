"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../../../database/methods/user");
const user_model_1 = require("../../../database/models/user.model");
require("../../../database/models/family.model");
require("../../../database/models/affinity.model");
require("../../../database/models/serie.model");
require("../../../database/models/card.model");
require("../../../database/models/booster.model");
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
    await mongoose_1.default.connect(mongoServer.getUri() + "findByIdWithBoosters");
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.beforeEach)(async () => {
    await user_model_1.UserModel.deleteMany({});
});
(0, globals_1.describe)("findByIdWithBoosters (user.findByIdWithBoosters.ts)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner l'utilisateur avec ses boosters", async () => {
            const created = await user_model_1.UserModel.create(validUser);
            console.log("Created user id:", created._id.toString());
            const result = await (0, user_1.findByIdWithBoosters)(created._id.toString());
            console.log("Result ok:", result.ok);
            console.log("Result error:", !result.ok ? result.error : "none");
            (0, globals_1.expect)(result.ok).toBe(true);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner une erreur si l'id est invalide", async () => {
            const result = await (0, user_1.findByIdWithBoosters)("invalid-id");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("Erreur lors de la recherche avec boosters");
            }
        });
    });
});
//# sourceMappingURL=findByIdWithBoosters.database.test.js.map