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
const card_fetch_1 = require("../../../services/card/card.fetch");
const cardMethods = __importStar(require("../../../database/methods/card/card.find"));
const cardMapper = __importStar(require("../../../database/mapper/card.mapper"));
const Result_1 = require("../../../shared/Result");
// Mock des dépendances externes
globals_1.jest.mock("@database/methods/card/card.find");
globals_1.jest.mock("@database/mapper/card.mapper");
// Mocks de données pour les tests
const mockCards = [
    {
        id: "card-1",
        name: "Dragon Blanc",
        description: "Un monstre puissant",
        rarity: "Légendaire",
        type: "Dragon",
        family: { name: "Lumière" },
        affinity: { name: "Feu" },
        serie: { id_serie: { name: "Set de Base" } }
    },
    {
        id: "card-2",
        name: "Magicien Sombre",
        description: "Le maître des magies",
        rarity: "Épique",
        type: "Magicien",
        family: { name: "Ténèbres" },
        affinity: { name: "Eau" },
        serie: { id_serie: { name: "L'extension" } }
    }
];
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    // Par défaut, mapCard retourne la carte telle quelle pour simplifier les assertions
    globals_1.jest.mocked(cardMapper.mapCard).mockImplementation((card) => card);
});
(0, globals_1.describe)("fetchCards", () => {
    const emptyFilters = { q: "", rarity: [], type: [], serie: [] };
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner toutes les cartes mappées si aucun filtre n'est appliqué", async () => {
            globals_1.jest.mocked(cardMethods.findAllCards).mockResolvedValue((0, Result_1.ok)(mockCards));
            const result = await (0, card_fetch_1.fetchCards)(emptyFilters);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(2);
                (0, globals_1.expect)(result.value[0]).toEqual(mockCards[0]);
            }
            (0, globals_1.expect)(cardMapper.mapCard).toHaveBeenCalledTimes(2);
        });
        (0, globals_1.it)("devrait filtrer les cartes par recherche textuelle (q)", async () => {
            globals_1.jest.mocked(cardMethods.findAllCards).mockResolvedValue((0, Result_1.ok)(mockCards));
            const result = await (0, card_fetch_1.fetchCards)({ ...emptyFilters, q: "bLaNc" });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(1);
                (0, globals_1.expect)(result.value[0].id).toBe("card-1");
            }
        });
        (0, globals_1.it)("devrait filtrer les cartes par rareté", async () => {
            globals_1.jest.mocked(cardMethods.findAllCards).mockResolvedValue((0, Result_1.ok)(mockCards));
            const result = await (0, card_fetch_1.fetchCards)({ ...emptyFilters, rarity: ["Épique"] });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(1);
                (0, globals_1.expect)(result.value[0].id).toBe("card-2");
            }
        });
        (0, globals_1.it)("devrait filtrer les cartes par type", async () => {
            globals_1.jest.mocked(cardMethods.findAllCards).mockResolvedValue((0, Result_1.ok)(mockCards));
            const result = await (0, card_fetch_1.fetchCards)({ ...emptyFilters, type: ["Dragon"] });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(1);
                (0, globals_1.expect)(result.value[0].id).toBe("card-1");
            }
        });
        (0, globals_1.it)("devrait filtrer les cartes par série", async () => {
            globals_1.jest.mocked(cardMethods.findAllCards).mockResolvedValue((0, Result_1.ok)(mockCards));
            const result = await (0, card_fetch_1.fetchCards)({ ...emptyFilters, serie: ["L'extension"] });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(1);
                (0, globals_1.expect)(result.value[0].id).toBe("card-2");
            }
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner NO_CARDS si la valeur retournée est nulle ou indéfinie", async () => {
            globals_1.jest.mocked(cardMethods.findAllCards).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, card_fetch_1.fetchCards)(emptyFilters);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("NO_CARDS");
            }
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si la requête échoue", async () => {
            globals_1.jest.mocked(cardMethods.findAllCards).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, card_fetch_1.fetchCards)(emptyFilters);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
        });
    });
});
//# sourceMappingURL=cardFetch.service.test.js.map