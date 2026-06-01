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
const deck_update_1 = require("../../../services/deck/deck.update");
const deckMethods = __importStar(require("../../../database/methods/deck/deck.updateById"));
const Result_1 = require("../../../shared/Result");
const mongoose_1 = require("mongoose");
// Mock de la dépendance de base de données
globals_1.jest.mock("@database/methods/deck/deck.updateById");
(0, globals_1.describe)("updateDeck", () => {
    const userId = "user-123";
    const deckId = "deck-456";
    // Simulation d'identifiants ObjectId de cartes retournés par Mongoose
    const cardId1 = new mongoose_1.Types.ObjectId();
    const cardId2 = new mongoose_1.Types.ObjectId();
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait mettre à jour le deck avec succès et formater la réponse", async () => {
            const updateInput = {
                name: "Nouveau Nom de Deck",
                cards: [cardId1.toString(), cardId2.toString()],
            };
            // Objet simulé retourné par la BDD après modification
            const mockUpdatedDeckDoc = {
                _id: deckId,
                name: "Nouveau Nom de Deck",
                isActive: true,
                cards: [cardId1, cardId2], // Mongoose stocke des ObjectIds
            };
            globals_1.jest.mocked(deckMethods.updateById).mockResolvedValue((0, Result_1.ok)(mockUpdatedDeckDoc));
            const result = await (0, deck_update_1.updateDeck)(userId, deckId, updateInput);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toEqual({
                    id: deckId,
                    name: "Nouveau Nom de Deck",
                    isActive: true,
                    // Vérifie la conversion implicite des ObjectIds en string[]
                    cards: [cardId1.toString(), cardId2.toString()],
                });
            }
            // Vérifie que la fonction BDD a bien reçu l'input d'origine
            (0, globals_1.expect)(deckMethods.updateById).toHaveBeenCalledWith(userId, deckId, updateInput);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner DECK_NOT_FOUND si la méthode BDD renvoie cette erreur", async () => {
            globals_1.jest.mocked(deckMethods.updateById).mockResolvedValue((0, Result_1.err)("DECK_NOT_FOUND"));
            const result = await (0, deck_update_1.updateDeck)(userId, deckId, { name: "Test" });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DECK_NOT_FOUND");
            }
        });
        (0, globals_1.it)("devrait retourner UNAUTHORIZED_DECK si le deck n'appartient pas à l'utilisateur", async () => {
            globals_1.jest.mocked(deckMethods.updateById).mockResolvedValue((0, Result_1.err)("UNAUTHORIZED_DECK"));
            const result = await (0, deck_update_1.updateDeck)(userId, deckId, { name: "Test" });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("UNAUTHORIZED_DECK");
            }
        });
        (0, globals_1.it)("devrait retourner INVALID_CARD_COUNT si le nombre de cartes n'est pas correct", async () => {
            globals_1.jest.mocked(deckMethods.updateById).mockResolvedValue((0, Result_1.err)("INVALID_CARD_COUNT"));
            const result = await (0, deck_update_1.updateDeck)(userId, deckId, { cards: ["1", "2"] });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("INVALID_CARD_COUNT");
            }
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR pour toute autre erreur technique", async () => {
            globals_1.jest.mocked(deckMethods.updateById).mockResolvedValue((0, Result_1.err)("UNKNOWN_MONGO_CRASH"));
            const result = await (0, deck_update_1.updateDeck)(userId, deckId, { name: "Test" });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
        });
    });
});
//# sourceMappingURL=update.services.test.js.map