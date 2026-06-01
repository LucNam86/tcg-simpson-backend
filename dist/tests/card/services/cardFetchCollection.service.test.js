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
const card_fetchCollection_1 = require("../../../services/card/card.fetchCollection");
const userMethods = __importStar(require("../../../database/methods/user"));
const userMapper = __importStar(require("../../../database/mapper"));
const Result_1 = require("../../../shared/Result");
// Mock des dépendances externes
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/mapper");
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
const mockPopulatedUser = {
    _id: "user-id-123",
    myCollection: mockCards,
};
// Par défaut, mapCard retourne la carte telle quelle pour simplifier les assertions
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    globals_1.jest.mocked(userMapper.mapCard).mockImplementation((card) => card);
});
(0, globals_1.describe)("fetchUserCollection", () => {
    const emptyFilters = { q: "", rarity: [], type: [], serie: [] };
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner la collection complète mappée si aucun filtre n'est appliqué", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockPopulatedUser));
            const result = await (0, card_fetchCollection_1.fetchUserCollection)("user-id-123", emptyFilters);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(2);
                (0, globals_1.expect)(result.value[0]).toEqual(mockCards[0]);
            }
            (0, globals_1.expect)(userMapper.mapCard).toHaveBeenCalledTimes(2);
        });
        (0, globals_1.it)("devrait filtrer la collection par recherche textuelle (q)", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockPopulatedUser));
            // Test de recherche insensible à la casse sur le nom
            const result = await (0, card_fetchCollection_1.fetchUserCollection)("user-id-123", { ...emptyFilters, q: "mAgIcIeN" });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(1);
                (0, globals_1.expect)(result.value[0].id).toBe("card-2");
            }
        });
        (0, globals_1.it)("devrait filtrer la collection par rareté", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockPopulatedUser));
            const result = await (0, card_fetchCollection_1.fetchUserCollection)("user-id-123", { ...emptyFilters, rarity: ["Légendaire"] });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(1);
                (0, globals_1.expect)(result.value[0].id).toBe("card-1");
            }
        });
        (0, globals_1.it)("devrait filtrer la collection par type", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockPopulatedUser));
            const result = await (0, card_fetchCollection_1.fetchUserCollection)("user-id-123", { ...emptyFilters, type: ["Magicien"] });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(1);
                (0, globals_1.expect)(result.value[0].id).toBe("card-2");
            }
        });
        (0, globals_1.it)("devrait filtrer la collection par série", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockPopulatedUser));
            const result = await (0, card_fetchCollection_1.fetchUserCollection)("user-id-123", { ...emptyFilters, serie: ["Set de Base"] });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(1);
                (0, globals_1.expect)(result.value[0].id).toBe("card-1");
            }
        });
        (0, globals_1.it)("devrait retourner un tableau vide si 'myCollection' est indéfinie", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)({ _id: "user-id-123" }) // Pas de champ myCollection
            );
            const result = await (0, card_fetchCollection_1.fetchUserCollection)("user-id-123", emptyFilters);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toEqual([]);
            }
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si le document utilisateur est null", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, card_fetchCollection_1.fetchUserCollection)("user-id-123", emptyFilters);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
            }
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si la requête à la base de données échoue", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, card_fetchCollection_1.fetchUserCollection)("user-id-123", emptyFilters);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
        });
    });
});
//# sourceMappingURL=cardFetchCollection.service.test.js.map