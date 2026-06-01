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
const booster_add_1 = require("../../../services/booster/booster.add");
const userMethods = __importStar(require("../../../database/methods/user"));
const boosterMethods = __importStar(require("../../../database/methods/booster/booster.findById"));
const saveBoosterMethods = __importStar(require("../../../database/methods/booster/booster.save"));
const updateMoneyMethods = __importStar(require("../../../database/methods/user/update/user.updateMoneyById"));
const Result_1 = require("../../../shared/Result");
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/methods/booster/booster.findById");
globals_1.jest.mock("@database/methods/booster/booster.save");
globals_1.jest.mock("@database/methods/user/update/user.updateMoneyById");
const mockUser = {
    _id: "user-id-123",
    pseudo: "TestUser",
    email: "test@example.com",
    money: 100,
};
const mockBooster = {
    _id: "booster-id-123",
    name: "Booster Série 1",
    price: 50,
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
});
(0, globals_1.describe)("addBooster", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner le nouveau solde après achat", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(boosterMethods.findById).mockResolvedValue((0, Result_1.ok)(mockBooster));
            globals_1.jest.mocked(saveBoosterMethods.saveBoosterToUser).mockResolvedValue((0, Result_1.ok)(undefined));
            globals_1.jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(50));
            const result = await (0, booster_add_1.addBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok)
                (0, globals_1.expect)(result.value.money).toBe(50);
        });
        (0, globals_1.it)("devrait déduire le prix du booster de la money", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(boosterMethods.findById).mockResolvedValue((0, Result_1.ok)(mockBooster));
            globals_1.jest.mocked(saveBoosterMethods.saveBoosterToUser).mockResolvedValue((0, Result_1.ok)(undefined));
            globals_1.jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(50));
            await (0, booster_add_1.addBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(updateMoneyMethods.updateMoneyById).toHaveBeenCalledWith("user-id-123", 50 // 100 - 50
            );
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si l'utilisateur est null", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, booster_add_1.addBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner BOOSTER_NOT_FOUND si le booster est null", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(boosterMethods.findById).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, booster_add_1.addBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("BOOSTER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner NOT_ENOUGH_MONEY si la money est insuffisante", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)({ ...mockUser, money: 10 }));
            globals_1.jest.mocked(boosterMethods.findById).mockResolvedValue((0, Result_1.ok)(mockBooster));
            const result = await (0, booster_add_1.addBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("NOT_ENOUGH_MONEY");
        });
    });
    (0, globals_1.describe)("erreurs base de données", () => {
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si findById user échoue", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, booster_add_1.addBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si findById booster échoue", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(boosterMethods.findById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, booster_add_1.addBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si saveBoosterToUser échoue", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(boosterMethods.findById).mockResolvedValue((0, Result_1.ok)(mockBooster));
            globals_1.jest.mocked(saveBoosterMethods.saveBoosterToUser).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, booster_add_1.addBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si updateMoneyById échoue", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(boosterMethods.findById).mockResolvedValue((0, Result_1.ok)(mockBooster));
            globals_1.jest.mocked(saveBoosterMethods.saveBoosterToUser).mockResolvedValue((0, Result_1.ok)(undefined));
            globals_1.jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, booster_add_1.addBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=add.booster.service.test.js.map