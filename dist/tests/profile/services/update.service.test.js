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
const profile_update_1 = require("../../../services/profile/profile.update");
const userMethods = __importStar(require("../../../database/methods/user"));
const Result_1 = require("../../../shared/Result");
const bcrypt_1 = __importDefault(require("bcrypt"));
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("bcrypt");
const mockUpdatedUser = {
    pseudo: "UpdatedUser",
    money: 100,
    passwordHash: "hashed-password",
    email: "test@example.com",
    avatar: "/avatars/avatar-1.webp",
    darkMode: false,
    countdownEnds: new Date(),
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    globals_1.jest.mocked(bcrypt_1.default.hash).mockResolvedValue("new-hashed-password");
});
(0, globals_1.describe)("updateUser", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait mettre à jour le pseudo", async () => {
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)(mockUpdatedUser));
            const result = await (0, profile_update_1.updateUser)("user-id-123", { pseudo: "UpdatedUser" });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value.pseudo).toBe("UpdatedUser");
                (0, globals_1.expect)(result.value.money).toBe(100);
            }
        });
        (0, globals_1.it)("devrait hasher le mot de passe avant de mettre à jour", async () => {
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)(mockUpdatedUser));
            await (0, profile_update_1.updateUser)("user-id-123", { password: "newpassword123" });
            (0, globals_1.expect)(bcrypt_1.default.hash).toHaveBeenCalledWith("newpassword123", globals_1.expect.any(Number));
            (0, globals_1.expect)(userMethods.updateById).toHaveBeenCalledWith("user-id-123", globals_1.expect.objectContaining({ passwordHash: "new-hashed-password" }));
        });
        (0, globals_1.it)("devrait mettre à jour l'avatar", async () => {
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)(mockUpdatedUser));
            await (0, profile_update_1.updateUser)("user-id-123", { avatar: "/avatars/avatar-2.webp" });
            (0, globals_1.expect)(userMethods.updateById).toHaveBeenCalledWith("user-id-123", globals_1.expect.objectContaining({ avatar: "/avatars/avatar-2.webp" }));
        });
        (0, globals_1.it)("ne devrait pas inclure le password en clair dans la mise à jour", async () => {
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)(mockUpdatedUser));
            await (0, profile_update_1.updateUser)("user-id-123", { password: "newpassword123" });
            const updateCall = globals_1.jest.mocked(userMethods.updateById).mock.calls[0][1];
            (0, globals_1.expect)(updateCall.password).toBeUndefined();
        });
        (0, globals_1.it)("ne devrait pas appeler updateById avec des champs vides", async () => {
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)(mockUpdatedUser));
            await (0, profile_update_1.updateUser)("user-id-123", {});
            (0, globals_1.expect)(userMethods.updateById).toHaveBeenCalledWith("user-id-123", {});
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si la valeur retournée est null", async () => {
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, profile_update_1.updateUser)("user-id-123", { pseudo: "UpdatedUser" });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner PSEUDO_ALREADY_USED si le pseudo est déjà utilisé", async () => {
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.err)("PSEUDO_ALREADY_USED"));
            const result = await (0, profile_update_1.updateUser)("user-id-123", { pseudo: "ExistingUser" });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("PSEUDO_ALREADY_USED");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR pour les autres erreurs BDD", async () => {
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, profile_update_1.updateUser)("user-id-123", { pseudo: "UpdatedUser" });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=update.service.test.js.map