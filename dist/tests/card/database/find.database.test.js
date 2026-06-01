"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const card_find_1 = require("../../../database/methods/card/card.find");
const card_model_1 = require("../../../database/models/card.model");
// Importation des modèles requis pour tester le .populate()
require("../../../database/models/family.model");
require("../../../database/models/affinity.model");
require("../../../database/models/serie.model");
let mongoServer;
// Génération d'ObjectIds valides pour simuler les relations populées
const mockFamilyId = new mongoose_1.default.Types.ObjectId();
const mockAffinityId = new mongoose_1.default.Types.ObjectId();
const mockSerieId = new mongoose_1.default.Types.ObjectId();
// "as const" permet de verrouiller les types littéraux (ex: type: "Personnage" au lieu de type: string)
const validCard = {
    name: "Dragon Blanc",
    slug: "dragon-blanc",
    description: "Un monstre mythique",
    rarity: "3",
    type: "Personnage",
    PV: 3000,
    ATK: 2500,
    family: mockFamilyId,
    affinity: mockAffinityId,
    serie: {
        id_serie: mockSerieId,
        position: 1,
    },
};
(0, globals_1.beforeAll)(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri());
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.beforeEach)(async () => {
    await card_model_1.CardModel.deleteMany({});
    globals_1.jest.restoreAllMocks();
});
(0, globals_1.describe)("findAllCards", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner un tableau vide si aucune carte n'existe", async () => {
            const result = await (0, card_find_1.findAllCards)();
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toEqual([]);
            }
        });
        (0, globals_1.it)("devrait retourner toutes les cartes présentes en base de données", async () => {
            await card_model_1.CardModel.create(validCard);
            // FIX : On passe un slug unique ("magicien-sombre") pour éviter le conflit d'unicité en BDD
            await card_model_1.CardModel.create({
                ...validCard,
                name: "Magicien Sombre",
                slug: "magicien-sombre"
            });
            const result = await (0, card_find_1.findAllCards)();
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(2);
                (0, globals_1.expect)(result.value[0].name).toBe("Dragon Blanc");
                (0, globals_1.expect)(result.value[1].name).toBe("Magicien Sombre");
            }
        });
        (0, globals_1.it)("devrait appliquer les chaînages .populate sur les propriétés", async () => {
            await card_model_1.CardModel.create(validCard);
            const result = await (0, card_find_1.findAllCards)();
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                const card = result.value[0];
                (0, globals_1.expect)(card.family).toBeDefined();
                (0, globals_1.expect)(card.affinity).toBeDefined();
                (0, globals_1.expect)(card.serie).toBeDefined();
                (0, globals_1.expect)(card.serie?.id_serie).toBeDefined();
            }
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait intercepter l'erreur et renvoyer un message explicite en cas de crash de CardModel", async () => {
            globals_1.jest.spyOn(card_model_1.CardModel, "find").mockImplementationOnce(() => {
                throw new Error("Simulated database failure");
            });
            globals_1.jest.spyOn(console, "error").mockImplementation(() => { });
            const result = await (0, card_find_1.findAllCards)();
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("Erreur lors de la recherche de toutes les cartes");
            }
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=find.database.test.js.map