"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const deck_updateById_1 = require("../../../database/methods/deck/deck.updateById");
const deck_model_1 = require("../../../database/models/deck.model");
let mongoServer;
const mockUserId = new mongoose_1.default.Types.ObjectId();
const mockDeckId = new mongoose_1.default.Types.ObjectId();
// Génération de tableaux d'IDs factices pour les tests de cartes
const tenValidCardIds = Array.from({ length: 10 }, () => new mongoose_1.default.Types.ObjectId().toString());
const invalidCardIds = [new mongoose_1.default.Types.ObjectId().toString(), new mongoose_1.default.Types.ObjectId().toString()];
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
(0, globals_1.describe)("updateById (Integration)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait modifier uniquement le nom du deck avec succès", async () => {
            // 1. Création d'un deck initial
            await deck_model_1.DeckModel.create({
                _id: mockDeckId,
                user: mockUserId,
                name: "Ancien Nom",
                cards: [],
                isActive: false,
            });
            // 2. Mise à jour du nom uniquement
            const result = await (0, deck_updateById_1.updateById)(mockUserId.toString(), mockDeckId.toString(), {
                name: "Nouveau Nom de Deck",
            });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value.name).toBe("Nouveau Nom de Deck");
            }
            // 3. Vérification en base de données
            const deckEnBdd = await deck_model_1.DeckModel.findById(mockDeckId);
            (0, globals_1.expect)(deckEnBdd?.name).toBe("Nouveau Nom de Deck");
        });
        (0, globals_1.it)("devrait modifier les cartes si le tableau contient exactement 10 éléments", async () => {
            await deck_model_1.DeckModel.create({
                _id: mockDeckId,
                user: mockUserId,
                name: "Deck de Test",
                cards: [],
                isActive: false,
            });
            const result = await (0, deck_updateById_1.updateById)(mockUserId.toString(), mockDeckId.toString(), {
                cards: tenValidCardIds,
            });
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value.cards).toHaveLength(10);
                (0, globals_1.expect)(result.value.cards[0].toString()).toBe(tenValidCardIds[0]);
            }
            const deckEnBdd = await deck_model_1.DeckModel.findById(mockDeckId);
            (0, globals_1.expect)(deckEnBdd?.cards).toHaveLength(10);
        });
    });
    (0, globals_1.describe)("erreurs de validation métier", () => {
        (0, globals_1.it)("devrait retourner DECK_NOT_FOUND si le deck n'existe pas", async () => {
            const fakeDeckId = new mongoose_1.default.Types.ObjectId().toString();
            const result = await (0, deck_updateById_1.updateById)(mockUserId.toString(), fakeDeckId, { name: "Nouveau" });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DECK_NOT_FOUND");
            }
        });
        (0, globals_1.it)("devrait retourner UNAUTHORIZED_DECK si le deck appartient à un autre utilisateur", async () => {
            const unAutreUserId = new mongoose_1.default.Types.ObjectId();
            await deck_model_1.DeckModel.create({
                _id: mockDeckId,
                user: unAutreUserId, // Créé par quelqu'un d'autre
                name: "Deck Privé",
                cards: [],
                isActive: false,
            });
            // mockUserId essaie d'éditer le deck de unAutreUserId
            const result = await (0, deck_updateById_1.updateById)(mockUserId.toString(), mockDeckId.toString(), {
                name: "Tentative de Hack",
            });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("UNAUTHORIZED_DECK");
            }
            // Sécurité : Vérifie que le nom n'a pas bougé en BDD
            const deckEnBdd = await deck_model_1.DeckModel.findById(mockDeckId);
            (0, globals_1.expect)(deckEnBdd?.name).toBe("Deck Privé");
        });
        (0, globals_1.it)("devrait retourner INVALID_CARD_COUNT si le tableau de cartes fourni n'a pas une taille de 10", async () => {
            await deck_model_1.DeckModel.create({
                _id: mockDeckId,
                user: mockUserId,
                name: "Deck Stable",
                cards: [],
                isActive: false,
            });
            // Envoi de seulement 2 cartes au lieu de 10
            const result = await (0, deck_updateById_1.updateById)(mockUserId.toString(), mockDeckId.toString(), {
                cards: invalidCardIds,
            });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("INVALID_CARD_COUNT");
            }
            // Sécurité : Vérifie que le tableau de cartes est resté vide en BDD
            const deckEnBdd = await deck_model_1.DeckModel.findById(mockDeckId);
            (0, globals_1.expect)(deckEnBdd?.cards).toHaveLength(0);
        });
    });
    (0, globals_1.describe)("erreurs techniques", () => {
        (0, globals_1.it)("devrait capter l'exception et renvoyer DATABASE_ERROR en cas de crash Mongoose", async () => {
            // Force DeckModel.findById à jeter une erreur pour activer le bloc catch
            globals_1.jest.spyOn(deck_model_1.DeckModel, "findById").mockImplementationOnce(() => {
                throw new Error("Simulated database failure");
            });
            // Cache la sortie console.error dans le terminal de test
            globals_1.jest.spyOn(console, "error").mockImplementation(() => { });
            const result = await (0, deck_updateById_1.updateById)(mockUserId.toString(), mockDeckId.toString(), { name: "Test" });
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=updateById.database.test.js.map