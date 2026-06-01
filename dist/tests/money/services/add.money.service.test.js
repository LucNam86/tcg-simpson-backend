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
const profile_1 = require("../../../services/profile");
const userMethods = __importStar(require("../../../database/methods/user"));
const Result_1 = require("../../../shared/Result");
globals_1.jest.mock("@database/methods/user");
const mockUser = {
    _id: "user-id-123",
    pseudo: "TestUser",
    email: "test@example.com",
    money: 100,
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
});
(0, globals_1.describe)("addMoney", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner le nouveau solde après ajout", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(userMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(150));
            const result = await (0, profile_1.addMoney)("user-id-123", 50);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok)
                (0, globals_1.expect)(result.value).toBe(150);
        });
        (0, globals_1.it)("devrait calculer le nouveau solde correctement", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(userMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(300));
            await (0, profile_1.addMoney)("user-id-123", 200);
            (0, globals_1.expect)(userMethods.updateMoneyById).toHaveBeenCalledWith("user-id-123", 300 // 100 + 200
            );
        });
        (0, globals_1.it)("devrait gérer un solde initial à 0", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ ...mockUser, money: 0 }));
            globals_1.jest.mocked(userMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(50));
            await (0, profile_1.addMoney)("user-id-123", 50);
            (0, globals_1.expect)(userMethods.updateMoneyById).toHaveBeenCalledWith("user-id-123", 50);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si l'utilisateur est null", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, profile_1.addMoney)("user-id-123", 50);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si findById échoue", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, profile_1.addMoney)("user-id-123", 50);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si updateMoneyById échoue", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(userMethods.updateMoneyById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, profile_1.addMoney)("user-id-123", 50);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=add.money.service.test.js.map