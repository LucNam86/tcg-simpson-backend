"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const profile_fetchById_1 = require("../../../services/profile/profile.fetchById");
const userMethods = __importStar(require("../../../database/methods/user"));
const userMapper = __importStar(require("../../../database/mapper"));
const Result_1 = require("../../../shared/Result");
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/mapper");
const mockPopulatedUser = {
    _id: "user-id-123",
    pseudo: "TestUser",
    email: "test@example.com",
    avatar: "/avatars/avatar-1.webp",
    money: 100,
    darkMode: false,
    countdownEnds: new Date(),
    myCollection: [],
    boosters: [],
    decks: [],
    friends: [],
};
const mockMappedUser = {
    id: "user-id-123",
    pseudo: "TestUser",
    email: "test@example.com",
    avatar: "/avatars/avatar-1.webp",
    money: 100,
    darkMode: false,
    countdownEnds: new Date(),
    myCollection: [],
    boosters: [],
    decks: [],
    friends: [],
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    globals_1.jest.mocked(userMapper.mapUser).mockReturnValue(mockMappedUser);
});
(0, globals_1.describe)("fetchUserById", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner le profil mappé", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockPopulatedUser));
            const result = await (0, profile_fetchById_1.fetchUserById)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toEqual(mockMappedUser);
            }
        });
        (0, globals_1.it)("devrait appeler mapUser avec le document populé", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockPopulatedUser));
            await (0, profile_fetchById_1.fetchUserById)("user-id-123");
            (0, globals_1.expect)(userMapper.mapUser).toHaveBeenCalledWith(mockPopulatedUser);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si le document est null", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, profile_fetchById_1.fetchUserById)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si la requête BDD échoue", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, profile_fetchById_1.fetchUserById)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=fetch.service.test.js.map