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
const deck_remove_1 = require("../../../services/deck/deck.remove");
const deckMethods = __importStar(require("../../../database/methods/deck"));
const Result_1 = require("../../../shared/Result");
// Mock de la dépendance de base de données
globals_1.jest.mock("@database/methods/deck");
(0, globals_1.describe)("removeUserDeck", () => {
    const userId = "user-123";
    const deckId = "deck-789";
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait supprimer le deck avec succès et retourner void (undefined)", async () => {
            // Simulation d'une suppression réussie en BDD
            globals_1.jest.mocked(deckMethods.deleteDeck).mockResolvedValue((0, Result_1.ok)(undefined));
            const result = await (0, deck_remove_1.removeUserDeck)(userId, deckId);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toBeUndefined();
            }
            // On s'assure que la fonction BDD a bien été appelée avec les bons paramètres
            (0, globals_1.expect)(deckMethods.deleteDeck).toHaveBeenCalledWith(userId, deckId);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner DECK_NOT_FOUND si la méthode BDD renvoie cette erreur", async () => {
            globals_1.jest.mocked(deckMethods.deleteDeck).mockResolvedValue((0, Result_1.err)("DECK_NOT_FOUND"));
            const result = await (0, deck_remove_1.removeUserDeck)(userId, deckId);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DECK_NOT_FOUND");
            }
        });
        (0, globals_1.it)("devrait retourner UNAUTHORIZED_DECK si le deck n'appartient pas à l'utilisateur", async () => {
            globals_1.jest.mocked(deckMethods.deleteDeck).mockResolvedValue((0, Result_1.err)("UNAUTHORIZED_DECK"));
            const result = await (0, deck_remove_1.removeUserDeck)(userId, deckId);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("UNAUTHORIZED_DECK");
            }
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR pour n'importe quelle autre erreur technique", async () => {
            globals_1.jest.mocked(deckMethods.deleteDeck).mockResolvedValue((0, Result_1.err)("MOCK_MONGO_CRASH"));
            const result = await (0, deck_remove_1.removeUserDeck)(userId, deckId);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
        });
    });
});
//# sourceMappingURL=remove.services.test.js.map