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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const globals_1 = require("@jest/globals");
const card_get_1 = __importDefault(require("../../../routes/card/card.get"));
const cardService = __importStar(require("../../../services/card/card.fetch"));
const Result_1 = require("../../../shared/Result");
// Mock du service
globals_1.jest.mock("@services/card/card.fetch");
// Configuration de l'application Express pour le test
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/cards", card_get_1.default);
const mockCards = [
    {
        id: "card-1",
        name: "Dragon Blanc",
        rarity: "Légendaire",
        type: "Dragon",
        serie: "Set de Base",
    },
];
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
});
(0, globals_1.describe)("GET /cards", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner 200 avec la liste des cartes sans filtres", async () => {
            globals_1.jest.mocked(cardService.fetchCards).mockResolvedValue((0, Result_1.ok)(mockCards));
            const res = await (0, supertest_1.default)(app).get("/cards");
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toEqual(mockCards);
            (0, globals_1.expect)(cardService.fetchCards).toHaveBeenCalledWith({
                q: undefined,
                rarity: [],
                type: [],
                serie: [],
            });
        });
        (0, globals_1.it)("devrait formater correctement les query params simples en tableaux (toArray)", async () => {
            globals_1.jest.mocked(cardService.fetchCards).mockResolvedValue((0, Result_1.ok)(mockCards));
            // On envoie des strings simples dans l'URL (?rarity=Légendaire&type=Dragon)
            const res = await (0, supertest_1.default)(app)
                .get("/cards")
                .query({ q: "Dragon", rarity: "Légendaire", type: "Dragon", serie: "Set de Base" });
            (0, globals_1.expect)(res.status).toBe(200);
            // On vérifie que le service reçoit bien des tableaux grâce à la fonction de conversion interne
            (0, globals_1.expect)(cardService.fetchCards).toHaveBeenCalledWith({
                q: "Dragon",
                rarity: ["Légendaire"],
                type: ["Dragon"],
                serie: ["Set de Base"],
            });
        });
        (0, globals_1.it)("devrait transmettre les query params s'ils sont déjà fournis sous forme de tableaux", async () => {
            globals_1.jest.mocked(cardService.fetchCards).mockResolvedValue((0, Result_1.ok)([]));
            // Format tableau supporté par Express (?rarity=Rare&rarity=Épique)
            await (0, supertest_1.default)(app)
                .get("/cards")
                .query("rarity=Rare&rarity=Épique");
            (0, globals_1.expect)(cardService.fetchCards).toHaveBeenCalledWith({
                q: undefined,
                rarity: ["Rare", "Épique"],
                type: [],
                serie: [],
            });
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner 404 si le service renvoie NO_CARDS", async () => {
            globals_1.jest.mocked(cardService.fetchCards).mockResolvedValue((0, Result_1.err)("NO_CARDS"));
            const res = await (0, supertest_1.default)(app).get("/cards");
            (0, globals_1.expect)(res.status).toBe(404);
            (0, globals_1.expect)(res.body).toEqual({ error: "NO_CARDS" });
        });
        (0, globals_1.it)("devrait retourner 404 si le service renvoie DATABASE_ERROR", async () => {
            globals_1.jest.mocked(cardService.fetchCards).mockResolvedValue((0, Result_1.err)("DATABASE_ERROR"));
            const res = await (0, supertest_1.default)(app).get("/cards");
            (0, globals_1.expect)(res.status).toBe(404);
            (0, globals_1.expect)(res.body).toEqual({ error: "DATABASE_ERROR" });
        });
    });
});
//# sourceMappingURL=get.card.route.test.js.map