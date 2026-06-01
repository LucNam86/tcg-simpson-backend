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
const deck_fetch_1 = require("../../../services/deck/deck.fetch");
const userMethods = __importStar(require("../../../database/methods/user"));
const deckMapper = __importStar(require("../../../database/mapper/deck.mapper"));
const Result_1 = require("../../../shared/Result");
// Mock des dépendances externes
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/mapper/deck.mapper");
(0, globals_1.describe)("fetchUserDecks", () => {
    const userId = "user-id-123";
    // Mocks de données pour les tests
    const mockDecksBDD = [
        { _id: "deck-1", name: "Deck Feu", isActive: true, cards: [] },
        { _id: "deck-2", name: "Deck Eau", isActive: false, cards: [] }
    ];
    const mockUserWithDecks = {
        _id: userId,
        decks: mockDecksBDD,
    };
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        // Par défaut, mapDeck retourne le deck mocké pré-formaté pour simplifier les assertions
        globals_1.jest.mocked(deckMapper.mapDeck).mockImplementation((deck) => ({
            id: deck._id,
            name: deck.name,
            isActive: deck.isActive,
            cards: deck.cards,
        }));
    });
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner la liste des decks mappés de l'utilisateur", async () => {
            // Simulation d'une réponse positive de la BDD
            globals_1.jest.mocked(userMethods.findByIdWithDecks).mockResolvedValue((0, Result_1.ok)(mockUserWithDecks));
            const result = await (0, deck_fetch_1.fetchUserDecks)(userId);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(2);
                (0, globals_1.expect)(result.value[0]).toEqual({
                    id: "deck-1",
                    name: "Deck Feu",
                    isActive: true,
                    cards: [],
                });
            }
            // On s'assure que le mapper a bien été appelé pour chaque deck
            (0, globals_1.expect)(deckMapper.mapDeck).toHaveBeenCalledTimes(2);
        });
        (0, globals_1.it)("devrait retourner un tableau vide si l'utilisateur n'a aucun deck", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithDecks).mockResolvedValue((0, Result_1.ok)({ _id: userId, decks: [] }));
            const result = await (0, deck_fetch_1.fetchUserDecks)(userId);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toEqual([]);
            }
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait propager USER_NOT_FOUND si la méthode BDD renvoie cette erreur spécifique", async () => {
            // Simulation du cas où findByIdWithDecks renvoie explicitement USER_NOT_FOUND
            globals_1.jest.mocked(userMethods.findByIdWithDecks).mockResolvedValue((0, Result_1.err)("USER_NOT_FOUND"));
            const result = await (0, deck_fetch_1.fetchUserDecks)(userId);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
            }
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR pour n'importe quel autre échec de la BDD", async () => {
            // Simulation d'un crash générique ou d'une autre erreur de connexion
            globals_1.jest.mocked(userMethods.findByIdWithDecks).mockResolvedValue((0, Result_1.err)("UNKNOWN_MONGO_ERROR"));
            const result = await (0, deck_fetch_1.fetchUserDecks)(userId);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
        });
    });
});
//# sourceMappingURL=fetch.services.test.js.map