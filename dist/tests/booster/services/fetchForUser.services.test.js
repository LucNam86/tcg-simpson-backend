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
const booster_fetchForUser_1 = require("../../../services/booster/booster.fetchForUser");
const userMethods = __importStar(require("../../../database/methods/user"));
const userMapper = __importStar(require("../../../database/mapper"));
const Result_1 = require("../../../shared/Result");
// Mock des dépendances externes
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/mapper");
(0, globals_1.describe)("fetchUserBoosters", () => {
    const userId = "user-id-999";
    // Simulation des boosters bruts stockés en BDD
    const mockRawBoosters = [
        { id_serie: "serie-1", count: 3 },
        { id_serie: "serie-2", count: 1 }
    ];
    const mockUserWithBoosters = {
        _id: userId,
        boosters: mockRawBoosters,
    };
    // Résultat attendu après le passage dans le mapper
    const mockMappedBoosters = [
        { serieName: "Set de Base", remainingOpenings: 3 },
        { serieName: "L'extension", remainingOpenings: 1 }
    ];
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        // On force le comportement du mapper pour les tests de succès
        globals_1.jest.mocked(userMapper.mapUserBoosters).mockReturnValue(mockMappedBoosters);
    });
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner les boosters de l'utilisateur correctement formatés par le mapper", async () => {
            // Simulation d'une réponse positive de la BDD
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.ok)(mockUserWithBoosters));
            const result = await (0, booster_fetchForUser_1.fetchUserBoosters)(userId);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toEqual(mockMappedBoosters);
            }
            // Vérifications des appels de fonctions
            (0, globals_1.expect)(userMethods.findByIdWithBoosters).toHaveBeenCalledWith(userId);
            (0, globals_1.expect)(userMapper.mapUserBoosters).toHaveBeenCalledWith(mockRawBoosters);
        });
        (0, globals_1.it)("devrait retourner un résultat vide valide si l'utilisateur possède un tableau de boosters vide", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.ok)({ _id: userId, boosters: [] }));
            globals_1.jest.mocked(userMapper.mapUserBoosters).mockReturnValue([]);
            const result = await (0, booster_fetchForUser_1.fetchUserBoosters)(userId);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value).toEqual([]);
            }
            (0, globals_1.expect)(userMapper.mapUserBoosters).toHaveBeenCalledWith([]);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si la méthode BDD renvoie ok(null)", async () => {
            // Cas où la requête fonctionne mais l'utilisateur n'existe pas en BDD
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, booster_fetchForUser_1.fetchUserBoosters)(userId);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
            }
            // Le mapper ne doit pas être appelé si l'utilisateur est introuvable
            (0, globals_1.expect)(userMapper.mapUserBoosters).not.toHaveBeenCalled();
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si la méthode BDD renvoie un échec (result.ok === false)", async () => {
            // Cas d'une erreur de connexion ou crash BDD
            globals_1.jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue((0, Result_1.err)("MONGO_DISCONNECTED"));
            const result = await (0, booster_fetchForUser_1.fetchUserBoosters)(userId);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
            (0, globals_1.expect)(userMapper.mapUserBoosters).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=fetchForUser.services.test.js.map