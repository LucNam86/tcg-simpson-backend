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
const user_post_1 = __importDefault(require("../../../routes/user/user.post"));
const boosterService = __importStar(require("../../../services/booster"));
globals_1.jest.mock("@services/booster");
globals_1.jest.mock("@middleware/jwt.middleware", () => ({
    signToken: globals_1.jest.fn().mockReturnValue("mock-token"),
    jwtMiddleware: globals_1.jest.fn((req, res, next) => {
        req.user = { id: "user-id-123" };
        next();
    }),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/users", user_post_1.default);
const mockCards = [
    {
        id: "card-id-1",
        name: "Homer Simpson",
        slug: "homer",
        type: "Personnage",
        rarity: "3",
        ATK: 60,
        PV: 140,
        description: "Père de famille",
        serie: { id_serie: { id: "serie-id-1", name: "Série 1", total: 40 }, position: 1 },
        family: { id: "family-id-1", name: "Simpson", description: "Famille Simpson", bonus: { ATK: 20, PV: 60 } },
        affinity: { id: "affinity-id-1", name: "Homer et Marge", description: "Duo", bonus: { ATK: 0, PV: 80 } },
    },
];
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    const { jwtMiddleware } = require("../../../middleware/jwt.middleware");
    globals_1.jest.mocked(jwtMiddleware).mockImplementation((req, res, next) => {
        req.user = { id: "user-id-123" };
        next();
    });
});
(0, globals_1.describe)("POST /users/me/boosters/:boosterId/open", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner 200 avec les cartes obtenues", async () => {
            globals_1.jest.mocked(boosterService.openBooster).mockResolvedValue({
                ok: true,
                value: mockCards,
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/boosters/booster-id-123/open");
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body.cards).toBeDefined();
            (0, globals_1.expect)(res.body.cards).toHaveLength(1);
        });
        (0, globals_1.it)("devrait retourner les données des cartes correctement", async () => {
            globals_1.jest.mocked(boosterService.openBooster).mockResolvedValue({
                ok: true,
                value: mockCards,
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/boosters/booster-id-123/open");
            (0, globals_1.expect)(res.body.cards[0].name).toBe("Homer Simpson");
            (0, globals_1.expect)(res.body.cards[0].rarity).toBe("3");
        });
    });
    (0, globals_1.describe)("authentification", () => {
        (0, globals_1.it)("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
            const { jwtMiddleware } = require("../../../middleware/jwt.middleware");
            globals_1.jest.mocked(jwtMiddleware).mockImplementationOnce((req, res, next) => {
                req.user = undefined;
                next();
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/boosters/booster-id-123/open");
            (0, globals_1.expect)(res.status).toBe(401);
            (0, globals_1.expect)(res.body.error).toBe("UNAUTHORIZED");
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner 404 si le booster n'est pas trouvé", async () => {
            globals_1.jest.mocked(boosterService.openBooster).mockResolvedValue({
                ok: false,
                error: "BOOSTER_NOT_FOUND",
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/boosters/booster-id-123/open");
            (0, globals_1.expect)(res.status).toBe(404);
            (0, globals_1.expect)(res.body.error).toBe("BOOSTER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
            globals_1.jest.mocked(boosterService.openBooster).mockResolvedValue({
                ok: false,
                error: "USER_NOT_FOUND",
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/boosters/booster-id-123/open");
            (0, globals_1.expect)(res.status).toBe(404);
            (0, globals_1.expect)(res.body.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner 404 si aucun booster n'est disponible", async () => {
            globals_1.jest.mocked(boosterService.openBooster).mockResolvedValue({
                ok: false,
                error: "NO_BOOSTER_AVAILABLE",
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/boosters/booster-id-123/open");
            (0, globals_1.expect)(res.status).toBe(404);
            (0, globals_1.expect)(res.body.error).toBe("NO_BOOSTER_AVAILABLE");
        });
        (0, globals_1.it)("devrait retourner 404 si une erreur BDD survient", async () => {
            globals_1.jest.mocked(boosterService.openBooster).mockResolvedValue({
                ok: false,
                error: "DATABASE_ERROR",
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/boosters/booster-id-123/open");
            (0, globals_1.expect)(res.status).toBe(404);
            (0, globals_1.expect)(res.body.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=post.booster.open.route.test.js.map