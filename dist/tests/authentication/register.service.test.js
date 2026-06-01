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
const user_register_1 = require("../../services/authentication/user.register");
const userMethods = __importStar(require("../../database/methods/user"));
const boosterMethods = __importStar(require("../../database/methods/booster"));
const userMapper = __importStar(require("../../database/mapper/user.mapper"));
const Result_1 = require("../../shared/Result");
const bcrypt_1 = __importDefault(require("bcrypt"));
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/methods/booster");
globals_1.jest.mock("@database/mapper/user.mapper");
globals_1.jest.mock("bcrypt");
const mockInput = {
    pseudo: "TestUser",
    email: "test@example.com",
    password: "password123",
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
const mockBooster = { _id: "booster-id-1" };
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    globals_1.jest.mocked(bcrypt_1.default.hash).mockResolvedValue("hashed-password");
    globals_1.jest.mocked(userMapper.mapUserPublic).mockReturnValue(mockPublicUser);
});
(0, globals_1.describe)("registerUser", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait créer un utilisateur et retourner les données publiques", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.ok)([mockBooster]));
            globals_1.jest.mocked(userMethods.save).mockResolvedValue((0, Result_1.ok)("user-id-123"));
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ _id: "user-id-123" }));
            const result = await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok)
                (0, globals_1.expect)(result.value).toEqual(mockPublicUser);
        });
        (0, globals_1.it)("devrait hasher le mot de passe", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.ok)([mockBooster]));
            globals_1.jest.mocked(userMethods.save).mockResolvedValue((0, Result_1.ok)("user-id-123"));
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ _id: "user-id-123" }));
            await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(bcrypt_1.default.hash).toHaveBeenCalledWith(mockInput.password, globals_1.expect.any(Number));
        });
        (0, globals_1.it)("devrait mettre l'email en minuscules", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.ok)([mockBooster]));
            globals_1.jest.mocked(userMethods.save).mockResolvedValue((0, Result_1.ok)("user-id-123"));
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ _id: "user-id-123" }));
            await (0, user_register_1.registerUser)({ ...mockInput, email: "TEST@EXAMPLE.COM" });
            (0, globals_1.expect)(userMethods.save).toHaveBeenCalledWith(globals_1.expect.objectContaining({ email: "test@example.com" }));
        });
        (0, globals_1.it)("devrait assigner un avatar aléatoire valide", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.ok)([mockBooster]));
            globals_1.jest.mocked(userMethods.save).mockResolvedValue((0, Result_1.ok)("user-id-123"));
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ _id: "user-id-123" }));
            await (0, user_register_1.registerUser)(mockInput);
            const saveCall = globals_1.jest.mocked(userMethods.save).mock.calls[0][0];
            (0, globals_1.expect)(saveCall.avatar).toMatch(/^\/avatars\/avatar-([1-9]|1[0-3])\.webp$/);
        });
        (0, globals_1.it)("devrait assigner 100 donuts au départ", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.ok)([mockBooster]));
            globals_1.jest.mocked(userMethods.save).mockResolvedValue((0, Result_1.ok)("user-id-123"));
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ _id: "user-id-123" }));
            await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(userMethods.save).toHaveBeenCalledWith(globals_1.expect.objectContaining({ money: 100 }));
        });
        (0, globals_1.it)("devrait assigner tous les boosters disponibles", async () => {
            const mockBoosters = [{ _id: "booster-1" }, { _id: "booster-2" }];
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.ok)(mockBoosters));
            globals_1.jest.mocked(userMethods.save).mockResolvedValue((0, Result_1.ok)("user-id-123"));
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ _id: "user-id-123" }));
            await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(userMethods.save).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                boosters: [
                    { booster: "booster-1", number: 1 },
                    { booster: "booster-2", number: 1 },
                ],
            }));
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner EMAIL_TAKEN si l'email existe déjà", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)({ _id: "existing" }));
            const result = await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("EMAIL_TAKEN");
        });
        (0, globals_1.it)("devrait retourner PSEUDO_TAKEN si le pseudo existe déjà", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)({ _id: "existing" }));
            const result = await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("PSEUDO_TAKEN");
        });
    });
    (0, globals_1.describe)("erreurs base de données", () => {
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si findByEmail échoue", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si findByPseudo échoue", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si find boosters échoue", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner USER_CREATION_FAILED si save échoue", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.ok)([mockBooster]));
            globals_1.jest.mocked(userMethods.save).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_CREATION_FAILED");
        });
        (0, globals_1.it)("devrait retourner USER_CREATION_FAILED si findById après save échoue", async () => {
            globals_1.jest.mocked(userMethods.findByEmail).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.ok)([mockBooster]));
            globals_1.jest.mocked(userMethods.save).mockResolvedValue((0, Result_1.ok)("user-id-123"));
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, user_register_1.registerUser)(mockInput);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_CREATION_FAILED");
        });
    });
});
//# sourceMappingURL=register.service.test.js.map