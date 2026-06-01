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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const user_connect_1 = require("../../services/authentication/user.connect");
const userMethods = __importStar(require("../../database/methods/user"));
const userMapper = __importStar(require("../../database/mapper/user.mapper"));
const Result_1 = require("../../shared/Result");
const bcrypt_1 = __importDefault(require("bcrypt"));
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/mapper/user.mapper");
globals_1.jest.mock("bcrypt");
const mockUserDocument = {
    _id: "user-id-123",
    pseudo: "TestUser",
    email: "test@example.com",
    passwordHash: "hashed-password",
    avatar: "/avatars/avatar-1.webp",
    money: 100,
    darkMode: false,
    countdownEnds: new Date(),
};
const mockPublicUser = {
    id: "user-id-123",
    pseudo: "TestUser",
    email: "test@example.com",
    avatar: "/avatars/avatar-1.webp",
    money: 100,
    darkMode: false,
    countdownEnds: new Date(),
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    globals_1.jest.mocked(userMapper.mapUserPublic).mockReturnValue(mockPublicUser);
});
(0, globals_1.describe)("connectUser", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner les données publiques de l'utilisateur", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(mockUserDocument));
            globals_1.jest.mocked(bcrypt_1.default.compareSync).mockReturnValue(true);
            const result = await (0, user_connect_1.connectUser)({
                email: "test@example.com",
                password: "password123",
            });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok)
                (0, globals_1.expect)(result.value).toEqual(mockPublicUser);
        });
        (0, globals_1.it)("devrait appeler mapUserPublic avec le document utilisateur", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(mockUserDocument));
            globals_1.jest.mocked(bcrypt_1.default.compareSync).mockReturnValue(true);
            await (0, user_connect_1.connectUser)({ email: "test@example.com", password: "password123" });
            (0, globals_1.expect)(userMapper.mapUserPublic).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                pseudo: "TestUser",
                email: "test@example.com",
                passwordHash: "hashed-password",
            }));
        });
        (0, globals_1.it)("devrait vérifier le mot de passe avec le hash stocké", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(mockUserDocument));
            globals_1.jest.mocked(bcrypt_1.default.compareSync).mockReturnValue(true);
            await (0, user_connect_1.connectUser)({ email: "test@example.com", password: "password123" });
            (0, globals_1.expect)(bcrypt_1.default.compareSync).toHaveBeenCalledWith("password123", "hashed-password");
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner CREDENTIALS_UNKNOWN si l'email n'existe pas", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, user_connect_1.connectUser)({
                email: "unknown@example.com",
                password: "password123",
            });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("CREDENTIALS_UNKNOWN");
        });
        (0, globals_1.it)("devrait retourner CREDENTIALS_UNKNOWN si findByEmail échoue", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, user_connect_1.connectUser)({
                email: "test@example.com",
                password: "password123",
            });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("CREDENTIALS_UNKNOWN");
        });
        (0, globals_1.it)("devrait retourner WRONG_CREDENTIALS si le mot de passe est incorrect", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(mockUserDocument));
            globals_1.jest.mocked(bcrypt_1.default.compareSync).mockReturnValue(false);
            const result = await (0, user_connect_1.connectUser)({
                email: "test@example.com",
                password: "wrong-password",
            });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("WRONG_CREDENTIALS");
        });
        (0, globals_1.it)("ne devrait pas appeler mapUserPublic si le mot de passe est incorrect", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(mockUserDocument));
            globals_1.jest.mocked(bcrypt_1.default.compareSync).mockReturnValue(false);
            await (0, user_connect_1.connectUser)({ email: "test@example.com", password: "wrong-password" });
            (0, globals_1.expect)(userMapper.mapUserPublic).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=connect.service.test.js.map