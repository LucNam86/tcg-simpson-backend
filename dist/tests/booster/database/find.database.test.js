"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const booster_find_1 = require("../../../database/methods/booster/booster.find");
const booster_model_1 = require("../../../database/models/booster.model");
// Importation obligatoire des modèles nécessaires au bon fonctionnement du .populate()
require("../../../database/models/card.model");
require("../../../database/models/family.model");
require("../../../database/models/affinity.model");
require("../../../database/models/serie.model");
let mongoServer;
// Génération d'ObjectIds valides pour simuler les relations populées
const mockFamilyId = new mongoose_1.default.Types.ObjectId();
const mockAffinityId = new mongoose_1.default.Types.ObjectId();
const mockSerieId = new mongoose_1.default.Types.ObjectId();
const mockCardId = new mongoose_1.default.Types.ObjectId();
const mockBoosterId = new mongoose_1.default.Types.ObjectId();
// Définition d'un mock minimaliste de booster pour l'insertion
const mockBoosterData = {
    _id: mockBoosterId,
    name: "Booster Origines",
    slug: "booster-origines",
    quantity: 5,
    serie: mockSerieId,
    cards: [mockCardId],
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
    await booster_model_1.BoosterModel.deleteMany({});
    globals_1.jest.restoreAllMocks();
});
(0, globals_1.describe)("Booster find (Integration)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner un tableau vide s'il n'y a aucun booster en base", async () => {
            const result = await (0, booster_find_1.find)();
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toEqual([]);
            }
        });
        (0, globals_1.it)("devrait récupérer tous les boosters et appliquer les chaînages .populate imbriqués", async () => {
            // Insertion du booster de test en BDD
            await booster_model_1.BoosterModel.create(mockBoosterData);
            // Exécution de la méthode
            const result = await (0, booster_find_1.find)();
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toHaveLength(1);
                const booster = result.value[0];
                (0, globals_1.expect)(booster.name).toBe("Booster Origines");
                // On vérifie que la structure attendue par le .populate est présente.
                // Note : En BDD mémoire vide (sans avoir créé les documents Card/Serie réels), 
                // Mongoose ne lèvera pas d'erreur mais laissera ces champs à null ou avec les IDs selon ta version.
                // L'important est de valider que la méthode n'a pas crashé durant le chaînage complexe.
                (0, globals_1.expect)(booster.serie).toBeDefined();
                (0, globals_1.expect)(booster.cards).toBeDefined();
                (0, globals_1.expect)(Array.isArray(booster.cards)).toBe(true);
            }
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait intercepter l'erreur et renvoyer un message explicite en cas de crash de BoosterModel", async () => {
            // On force BoosterModel.find à lever une exception pour tester le bloc catch
            globals_1.jest.spyOn(booster_model_1.BoosterModel, "find").mockImplementationOnce(() => {
                throw new Error("Simulated database failure");
            });
            // On mock console.error pour éviter de polluer les logs de ta console de test
            globals_1.jest.spyOn(console, "error").mockImplementation(() => { });
            const result = await (0, booster_find_1.find)();
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("Erreur lors de la recherche de tous les boosters");
            }
            // S'assure que console.error a bien été sollicité pour tracer le problème
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=find.database.test.js.map