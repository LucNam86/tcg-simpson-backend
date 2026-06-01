"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const deck_updateActiveDeck_1 = require("../../../database/methods/deck/deck.updateActiveDeck");
const deck_model_1 = require("../../../database/models/deck.model");
let mongoServer;
const mockUserId = new mongoose_1.default.Types.ObjectId();
const mockDeckId1 = new mongoose_1.default.Types.ObjectId();
const mockDeckId2 = new mongoose_1.default.Types.ObjectId();
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
    globals_1.jest.restoreAllMocks();
});
(0, globals_1.describe)("updateActiveDeck (Integration)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait activer le deck ciblé et désactiver tous les autres decks de l'utilisateur", async () => {
            // 1. Création d'un premier deck actuellement ACTIF
            await deck_model_1.DeckModel.create({
                _id: mockDeckId1,
                user: mockUserId,
                name: "Deck Feu",
                cards: [],
                isActive: true,
            });
            // 2. Création d'un deuxième deck actuellement INACTIF (celui qu'on va activer)
            await deck_model_1.DeckModel.create({
                _id: mockDeckId2,
                user: mockUserId,
                name: "Deck Eau",
                cards: [],
                isActive: false,
            });
            // 3. Appel de la fonction pour activer le Deck Eau (mockDeckId2)
            const result = await (0, deck_updateActiveDeck_1.updateActiveDeck)(mockUserId.toString(), mockDeckId2.toString());
            (0, globals_1.expect)(result.ok).toBe(true);
            // 4. Vérification du basculement des états en base de données
            const deck1 = await deck_model_1.DeckModel.findById(mockDeckId1);
            const deck2 = await deck_model_1.DeckModel.findById(mockDeckId2);
            (0, globals_1.expect)(deck1?.isActive).toBe(false); // Le premier deck a bien été désactivé par le updateMany
            (0, globals_1.expect)(deck2?.isActive).toBe(true); // Le deuxième deck est bien devenu le deck actif
        });
    });
    (0, globals_1.describe)("erreurs de validation métier", () => {
        (0, globals_1.it)("devrait retourner DECK_NOT_FOUND si le deck n'existe pas en base", async () => {
            const fakeDeckId = new mongoose_1.default.Types.ObjectId().toString();
            const result = await (0, deck_updateActiveDeck_1.updateActiveDeck)(mockUserId.toString(), fakeDeckId);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DECK_NOT_FOUND");
            }
        });
        (0, globals_1.it)("devrait retourner UNAUTHORIZED_DECK si le deck appartient à un autre utilisateur", async () => {
            const unAutreUserId = new mongoose_1.default.Types.ObjectId();
            // On crée un deck lié à un autre utilisateur
            await deck_model_1.DeckModel.create({
                _id: mockDeckId1,
                user: unAutreUserId,
                name: "Deck Secret",
                cards: [],
                isActive: false,
            });
            // mockUserId tente d'activer le deck appartenant à unAutreUserId
            const result = await (0, deck_updateActiveDeck_1.updateActiveDeck)(mockUserId.toString(), mockDeckId1.toString());
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("UNAUTHORIZED_DECK");
            }
            // Sécurité : On vérifie que le statut du deck n'a pas bougé
            const deckEnBdd = await deck_model_1.DeckModel.findById(mockDeckId1);
            (0, globals_1.expect)(deckEnBdd?.isActive).toBe(false);
        });
    });
    (0, globals_1.describe)("erreurs techniques", () => {
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si une opération Mongoose lève une exception", async () => {
            // On force DeckModel.findById à crash pour déclencher le bloc catch
            globals_1.jest.spyOn(deck_model_1.DeckModel, "findById").mockImplementationOnce(() => {
                throw new Error("Simulated database failure");
            });
            // On cache les logs console.error pour le terminal de test
            globals_1.jest.spyOn(console, "error").mockImplementation(() => { });
            const result = await (0, deck_updateActiveDeck_1.updateActiveDeck)(mockUserId.toString(), mockDeckId1.toString());
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=updateActiveDeck.database.test.js.map