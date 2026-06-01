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
const booster_open_1 = require("../../../services/booster/booster.open");
const userMethods = __importStar(require("../../../database/methods/user"));
const cardMapper = __importStar(require("../../../database/mapper/card.mapper"));
const Result_1 = require("../../../shared/Result");
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/mapper/card.mapper");
const mockCard = {
    _id: "card-id-1",
    name: "Homer Simpson",
    slug: "homer",
    rarity: "3",
    type: "Personnage",
    family: { _id: "family-id-1", name: "Simpson", description: "Famille", bonus: { ATK: 20, PV: 60 } },
    affinity: { _id: "affinity-id-1", name: "Homer et Marge", description: "Duo", bonus: { ATK: 0, PV: 80 } },
    serie: { id_serie: { _id: "serie-id-1", name: "Série 1", total: 40 }, position: 1 },
};
const mockMappedCard = {
    id: "card-id-1",
    name: "Homer Simpson",
    slug: "homer",
    rarity: "3",
    type: "Personnage",
    ATK: 60,
    PV: 140,
    description: "Père de famille",
    family: { id: "family-id-1", name: "Simpson", description: "Famille", bonus: { ATK: 20, PV: 60 } },
    affinity: { id: "affinity-id-1", name: "Homer et Marge", description: "Duo", bonus: { ATK: 0, PV: 80 } },
    serie: { id_serie: { id: "serie-id-1", name: "Série 1", total: 40 }, position: 1 },
};
const mockUserWithBooster = {
    _id: "user-id-123",
    boosters: [
        {
            booster: {
                _id: { toString: () => "booster-id-123" },
                name: "Booster Série 1",
                quantity: 5,
                probabilities: [
                    { rarity: "Common", value: 70 },
                    { rarity: "Rare", value: 25 },
                    { rarity: "Legendary", value: 5 },
                ],
                cards: [mockCard, mockCard, mockCard, mockCard, mockCard],
            },
            number: 1,
        },
    ],
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    globals_1.jest.mocked(cardMapper.mapCard).mockReturnValue(mockMappedCard);
});
(0, globals_1.describe)("openBooster", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner des cartes mappées", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.ok)(mockUserWithBooster));
            globals_1.jest.mocked(userMethods.saveCardsToCollection).mockResolvedValue((0, Result_1.ok)(undefined));
            const result = await (0, booster_open_1.openBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(5);
                (0, globals_1.expect)(result.value[0]).toEqual(mockMappedCard);
            }
        });
        (0, globals_1.it)("devrait appeler saveCardsToCollection", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.ok)(mockUserWithBooster));
            globals_1.jest.mocked(userMethods.saveCardsToCollection).mockResolvedValue((0, Result_1.ok)(undefined));
            await (0, booster_open_1.openBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(userMethods.saveCardsToCollection).toHaveBeenCalledWith("user-id-123", "booster-id-123", globals_1.expect.any(Array));
        });
        (0, globals_1.it)("devrait retourner le bon nombre de cartes selon la quantité du booster", async () => {
            const mockUserWith3Cards = {
                ...mockUserWithBooster,
                boosters: [{
                        ...mockUserWithBooster.boosters[0],
                        booster: {
                            ...mockUserWithBooster.boosters[0].booster,
                            quantity: 3,
                        },
                    }],
            };
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.ok)(mockUserWith3Cards));
            globals_1.jest.mocked(userMethods.saveCardsToCollection).mockResolvedValue((0, Result_1.ok)(undefined));
            const result = await (0, booster_open_1.openBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok)
                (0, globals_1.expect)(result.value).toHaveLength(3);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si findByIdWithBoosters échoue", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, booster_open_1.openBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si l'utilisateur est null", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, booster_open_1.openBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner BOOSTER_NOT_FOUND si le booster n'est pas dans la liste", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.ok)(mockUserWithBooster));
            const result = await (0, booster_open_1.openBooster)("user-id-123", "wrong-booster-id");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("BOOSTER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner NO_BOOSTER_AVAILABLE si le nombre est 0", async () => {
            const mockUserWithEmptyBooster = {
                ...mockUserWithBooster,
                boosters: [{
                        ...mockUserWithBooster.boosters[0],
                        number: 0,
                    }],
            };
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.ok)(mockUserWithEmptyBooster));
            const result = await (0, booster_open_1.openBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("NO_BOOSTER_AVAILABLE");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si saveCardsToCollection échoue", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.ok)(mockUserWithBooster));
            globals_1.jest.mocked(userMethods.saveCardsToCollection).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, booster_open_1.openBooster)("user-id-123", "booster-id-123");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=open.booster.service.test.js.map