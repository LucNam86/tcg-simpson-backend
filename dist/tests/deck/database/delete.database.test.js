"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const deck_delete_1 = require("../../../database/methods/deck/deck.delete");
const deck_model_1 = require("../../../database/models/deck.model");
const user_model_1 = require("../../../database/models/user.model");
let mongoServer;
// Préparation des IDs de tests
const mockUserId = new mongoose_1.default.Types.ObjectId();
const mockDeckId = new mongoose_1.default.Types.ObjectId();
(0, globals_1.beforeAll)(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri());
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.beforeEach)(async () => {
    await deck_model_1.DeckModel.deleteMany({});
    await user_model_1.UserModel.deleteMany({});
    globals_1.jest.restoreAllMocks();
});
(0, globals_1.describe)("deleteDeck (Integration)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait supprimer le deck et le retirer du tableau de l'utilisateur", async () => {
            // 1. Création d'un faux utilisateur possédant le deck dans sa liste
            // Note: On utilise "as any" ou "as const" pour contourner la validation stricte des champs du schéma si nécessaire
            await user_model_1.UserModel.create({
                _id: mockUserId,
                pseudo: "PlayerOne",
                email: "player@test.com",
                passwordHash: "hashed-password",
                avatar: "/avatars/avatar-1.webp",
                money: 100,
                countdownEnds: new Date(),
                myCollection: [],
                boosters: [],
                decks: [mockDeckId],
                darkMode: false,
            });
            // 2. Création du deck lié à cet utilisateur
            await deck_model_1.DeckModel.create({
                _id: mockDeckId,
                user: mockUserId,
                name: "Mon Deck de Test",
                cards: []
            });
            // 3. Exécution de la fonction à tester
            const result = await (0, deck_delete_1.deleteDeck)(mockUserId.toString(), mockDeckId.toString());
            (0, globals_1.expect)(result.ok).toBe(true);
            // 4. Vérifications en base de données
            const deckEnBdd = await deck_model_1.DeckModel.findById(mockDeckId);
            (0, globals_1.expect)(deckEnBdd).toBeNull(); // Le deck doit avoir disparu
            const userEnBdd = await user_model_1.UserModel.findById(mockUserId);
            (0, globals_1.expect)(userEnBdd?.decks).not.toContainEqual(mockDeckId); // L'ID du deck doit être $pull de la liste
        });
    });
    (0, globals_1.describe)("erreurs de validation métier", () => {
        (0, globals_1.it)("devrait retourner DECK_NOT_FOUND si le deck n'existe pas", async () => {
            const fakeDeckId = new mongoose_1.default.Types.ObjectId().toString();
            const result = await (0, deck_delete_1.deleteDeck)(mockUserId.toString(), fakeDeckId);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DECK_NOT_FOUND");
            }
        });
        (0, globals_1.it)("devrait retourner UNAUTHORIZED_DECK si le deck appartient à un autre utilisateur", async () => {
            const unAutreUserId = new mongoose_1.default.Types.ObjectId();
            // Création d'un deck appartenant à "unAutreUserId"
            await deck_model_1.DeckModel.create({
                _id: mockDeckId,
                user: unAutreUserId,
                name: "Deck Secret",
                cards: []
            });
            // mockUserId essaie de supprimer le deck de unAutreUserId
            const result = await (0, deck_delete_1.deleteDeck)(mockUserId.toString(), mockDeckId.toString());
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("UNAUTHORIZED_DECK");
            }
            // Sécurité : On s'assure que le deck n'a pas été supprimé par erreur
            const deckEnBdd = await deck_model_1.DeckModel.findById(mockDeckId);
            (0, globals_1.expect)(deckEnBdd).not.toBeNull();
        });
    });
    (0, globals_1.describe)("erreurs techniques", () => {
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si une méthode Mongoose crash", async () => {
            // Simulation d'une panne BDD sur DeckModel.findById
            globals_1.jest.spyOn(deck_model_1.DeckModel, "findById").mockImplementationOnce(() => {
                throw new Error("Simulated database failure");
            });
            // On cache le console.error dans le terminal de test
            globals_1.jest.spyOn(console, "error").mockImplementation(() => { });
            const result = await (0, deck_delete_1.deleteDeck)(mockUserId.toString(), mockDeckId.toString());
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=delete.database.test.js.map