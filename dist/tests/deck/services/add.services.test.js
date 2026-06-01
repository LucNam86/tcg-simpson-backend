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
const deck_add_1 = require("../../../services/deck/deck.add");
const userMethods = __importStar(require("../../../database/methods/user"));
const deckMethods = __importStar(require("../../../database/methods/deck"));
const Result_1 = require("../../../shared/Result");
// Mock des dépendances de la base de données
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/methods/deck");
(0, globals_1.describe)("addDeck", () => {
    const userId = "user-123";
    const deckName = "Mon Deck de Feu";
    // Génération d'un tableau contenant exactement 10 IDs de cartes factices
    const validCards = Array.from({ length: 10 }, (_, i) => `card-id-${i}`);
    const invalidCards = ["card-1", "card-2"]; // Seulement 2 cartes
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait créer un deck actif si c'est le premier deck de l'utilisateur", async () => {
            // L'utilisateur n'a aucun deck existant
            const mockUser = { _id: userId, decks: [] };
            const mockSavedDeck = { _id: "deck-789", name: deckName, isActive: true };
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(deckMethods.saveDeck).mockResolvedValue((0, Result_1.ok)(mockSavedDeck));
            const result = await (0, deck_add_1.addDeck)({ userId, name: deckName, cards: validCards });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toEqual({
                    id: "deck-789",
                    name: deckName,
                    isActive: true, // Doit être true car decks.length === 0
                    cards: validCards,
                });
            }
            // Vérifie que saveDeck a été appelé avec les bons paramètres et isActive à true
            (0, globals_1.expect)(deckMethods.saveDeck).toHaveBeenCalledWith({
                userId,
                name: deckName,
                cards: validCards,
                isActive: true,
            });
        });
        (0, globals_1.it)("devrait créer un deck inactif si l'utilisateur possède déjà un deck", async () => {
            // L'utilisateur a déjà 1 deck
            const mockUser = { _id: userId, decks: ["existing-deck-id"] };
            const mockSavedDeck = { _id: "deck-789", name: deckName, isActive: false };
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(deckMethods.saveDeck).mockResolvedValue((0, Result_1.ok)(mockSavedDeck));
            const result = await (0, deck_add_1.addDeck)({ userId, name: deckName, cards: validCards });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value.isActive).toBe(false); // Doit être false car l'utilisateur a déjà un deck
            }
            (0, globals_1.expect)(deckMethods.saveDeck).toHaveBeenCalledWith({
                userId,
                name: deckName,
                cards: validCards,
                isActive: false,
            });
        });
        (0, globals_1.it)("devrait assigner un nom par défaut si aucun nom n'est fourni", async () => {
            const mockUser = { _id: userId, decks: [] };
            const mockSavedDeck = { _id: "deck-789", name: "Mon Super Deck", isActive: true };
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(deckMethods.saveDeck).mockResolvedValue((0, Result_1.ok)(mockSavedDeck));
            // On omet ou passe une chaîne vide pour le nom
            const result = await (0, deck_add_1.addDeck)({ userId, name: "", cards: validCards });
            (0, globals_1.expect)(result.ok).toBe(true);
            (0, globals_1.expect)(deckMethods.saveDeck).toHaveBeenCalledWith(globals_1.expect.objectContaining({ name: "Mon Super Deck" }));
        });
    });
    (0, globals_1.describe)("erreurs de validation et métier", () => {
        (0, globals_1.it)("devrait retourner INVALID_CARD_COUNT si le deck n'a pas exactement 10 cartes", async () => {
            const result = await (0, deck_add_1.addDeck)({ userId, name: deckName, cards: invalidCards });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("INVALID_CARD_COUNT");
            }
            // Le code doit bloquer avant même de chercher l'utilisateur en BDD
            (0, globals_1.expect)(userMethods.findById).not.toHaveBeenCalled();
        });
        (0, globals_1.it)("devrait retourner MAX_DECKS_REACHED si l'utilisateur possède déjà 3 decks ou plus", async () => {
            // Simulation d'un utilisateur au maximum de sa capacité de decks
            const mockUser = { _id: userId, decks: ["deck-1", "deck-2", "deck-3"] };
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            const result = await (0, deck_add_1.addDeck)({ userId, name: deckName, cards: validCards });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("MAX_DECKS_REACHED");
            }
            (0, globals_1.expect)(deckMethods.saveDeck).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)("erreurs de base de données", () => {
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si findById renvoie une valeur nulle", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, deck_add_1.addDeck)({ userId, name: deckName, cards: validCards });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
            }
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si findById échoue", async () => {
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, deck_add_1.addDeck)({ userId, name: deckName, cards: validCards });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si saveDeck échoue", async () => {
            const mockUser = { _id: userId, decks: [] };
            globals_1.jest.mocked(userMethods.findById).mockResolvedValue((0, Result_1.ok)(mockUser));
            globals_1.jest.mocked(deckMethods.saveDeck).mockResolvedValue((0, Result_1.err)("SAVE_ERROR"));
            const result = await (0, deck_add_1.addDeck)({ userId, name: deckName, cards: validCards });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
        });
    });
});
//# sourceMappingURL=add.services.test.js.map