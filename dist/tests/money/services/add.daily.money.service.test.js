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
const profile_updateDailyMoney_1 = require("../../../services/profile/profile.updateDailyMoney");
const userMethods = __importStar(require("../../../database/methods/user"));
const updateMoneyMethods = __importStar(require("../../../database/methods/user/update/user.updateMoneyById"));
const Result_1 = require("../../../shared/Result");
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/methods/user/update/user.updateMoneyById");
const mockUser = {
    _id: "user-id-123",
    pseudo: "TestUser",
    email: "test@example.com",
    money: 100,
    countdownEnds: null,
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
});
(0, globals_1.describe)("updateDailyMoney", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner le nouveau solde et countdownEnds", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(200));
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)({}));
            const result = await (0, profile_updateDailyMoney_1.updateDailyMoney)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value.money).toBe(200);
                (0, globals_1.expect)(result.value.countdownEnds).toBeDefined();
            }
        });
        (0, globals_1.it)("devrait ajouter 100 donuts au solde existant", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(200));
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)({}));
            await (0, profile_updateDailyMoney_1.updateDailyMoney)("user-id-123");
            (0, globals_1.expect)(updateMoneyMethods.updateMoneyById).toHaveBeenCalledWith("user-id-123", 200 // 100 + 100
            );
        });
        (0, globals_1.it)("devrait fonctionner si countdownEnds est null", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ ...mockUser, countdownEnds: null }));
            globals_1.jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(200));
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)({}));
            const result = await (0, profile_updateDailyMoney_1.updateDailyMoney)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(true);
        });
        (0, globals_1.it)("devrait fonctionner si countdownEnds est dans le passé", async () => {
            const pastDate = new Date(Date.now() - 1000).toISOString();
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ ...mockUser, countdownEnds: pastDate }));
            globals_1.jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(200));
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)({}));
            const result = await (0, profile_updateDailyMoney_1.updateDailyMoney)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(true);
        });
        (0, globals_1.it)("devrait mettre à jour countdownEnds à 12h dans le futur", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(200));
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)({}));
            const before = Date.now();
            await (0, profile_updateDailyMoney_1.updateDailyMoney)("user-id-123");
            const after = Date.now();
            const updateCall = globals_1.jest.mocked(userMethods.updateById).mock.calls[0][1];
            const countdownDate = new Date(updateCall.countdownEnds).getTime();
            const twelveHours = 12 * 60 * 60 * 1000;
            (0, globals_1.expect)(countdownDate).toBeGreaterThanOrEqual(before + twelveHours - 100);
            (0, globals_1.expect)(countdownDate).toBeLessThanOrEqual(after + twelveHours + 100);
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner NOT_READY si le cooldown n'est pas terminé", async () => {
            const futureDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ ...mockUser, countdownEnds: futureDate }));
            const result = await (0, profile_updateDailyMoney_1.updateDailyMoney)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("NOT_READY");
        });
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si l'utilisateur est null", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, profile_updateDailyMoney_1.updateDailyMoney)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
        });
    });
    (0, globals_1.describe)("erreurs base de données", () => {
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si findById échoue", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, profile_updateDailyMoney_1.updateDailyMoney)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si updateMoneyById échoue", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, profile_updateDailyMoney_1.updateDailyMoney)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si updateById échoue", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(200));
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, profile_updateDailyMoney_1.updateDailyMoney)("user-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=add.daily.money.service.test.js.map