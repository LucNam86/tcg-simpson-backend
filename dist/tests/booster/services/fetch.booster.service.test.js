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
const booster_fetch_1 = require("../../../services/booster/booster.fetch");
const boosterMethods = __importStar(require("../../../database/methods/booster"));
const boosterMapper = __importStar(require("../../../database/mapper/booster.mapper"));
const Result_1 = require("../../../shared/Result");
globals_1.jest.mock("@database/methods/booster");
globals_1.jest.mock("@database/mapper/booster.mapper");
const mockPopulatedBoosters = [
    {
        _id: "booster-id-123",
        name: "Booster Série 1",
        price: 100,
        slug: "booster-serie-1",
        quantity: 5,
        probabilities: [
            { rarity: "Common", value: 70 },
            { rarity: "Rare", value: 25 },
            { rarity: "Legendary", value: 5 },
        ],
        cards: [],
        serie: {
            _id: "serie-id-123",
            name: "Série 1",
        },
    },
];
const mockMappedBooster = {
    id: "booster-id-123",
    name: "Booster Série 1",
    price: 100,
    slug: "booster-serie-1",
    quantity: 5,
    probabilities: [
        { rarity: "Common", value: 70 },
        { rarity: "Rare", value: 25 },
        { rarity: "Legendary", value: 5 },
    ],
    cards: [],
    serie: {
        id_serie: "serie-id-123",
        position: 1,
    },
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    globals_1.jest
        .mocked(boosterMapper.mapBooster)
        .mockReturnValue(mockMappedBooster);
});
(0, globals_1.describe)("fetchBoosters", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner la liste des boosters mappés avec un résultat ok", async () => {
            globals_1.jest
                .mocked(boosterMethods.find)
                .mockResolvedValue((0, Result_1.ok)(mockPopulatedBoosters));
            const result = await (0, booster_fetch_1.fetchBoosters)();
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(1);
                (0, globals_1.expect)(result.value[0]).toEqual(mockMappedBooster);
                (0, globals_1.expect)(result.value[0].name).toBe("Booster Série 1");
            }
        });
        (0, globals_1.it)("devrait appeler le mapper pour chaque booster trouvé", async () => {
            globals_1.jest
                .mocked(boosterMethods.find)
                .mockResolvedValue((0, Result_1.ok)(mockPopulatedBoosters));
            await (0, booster_fetch_1.fetchBoosters)();
            (0, globals_1.expect)(boosterMapper.mapBooster).toHaveBeenCalledTimes(1);
            (0, globals_1.expect)(boosterMapper.mapBooster).toHaveBeenCalledWith(globals_1.expect.objectContaining({ _id: "booster-id-123", name: "Booster Série 1" }));
        });
        (0, globals_1.it)("devrait retourner un tableau vide si aucun booster n'est en BDD", async () => {
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.ok)([]));
            const result = await (0, booster_fetch_1.fetchBoosters)();
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(0);
            }
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si la méthode find() échoue", async () => {
            globals_1.jest
                .mocked(boosterMethods.find)
                .mockResolvedValue((0, Result_1.err)("Erreur lors de la recherche de tous les boosters"));
            const result = await (0, booster_fetch_1.fetchBoosters)();
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
        });
        (0, globals_1.it)("devrait retourner UNKNOWN_BOOSTER si la méthode find() renvoie une valeur null ou undefined", async () => {
            globals_1.jest.mocked(boosterMethods.find).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, booster_fetch_1.fetchBoosters)();
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("UNKNOWN_BOOSTER");
            }
        });
    });
});
//# sourceMappingURL=fetch.booster.service.test.js.map