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
const booster_get_1 = __importDefault(require("../../../routes/booster/booster.get"));
const boosterService = __importStar(require("../../../services/booster/booster.fetch"));
globals_1.jest.mock("@services/booster/booster.fetch");
globals_1.jest.mock("@middleware/jwt.middleware", () => ({
    jwtMiddleware: globals_1.jest.fn((req, res, next) => {
        req.user = { id: "user-id-123" };
        next();
    }),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/boosters", booster_get_1.default);
const mockBoosters = [
    {
        id: "booster-1",
        name: "Booster Série 1",
        price: 100,
        slug: "booster-serie-1",
        quantity: 0,
        cards: [],
        serie: {
            id_serie: "serie-id-123",
            position: 1,
        },
        probabilities: {
            normal: 70,
            rare: 25,
            legendary: 5,
        },
    },
];
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    const { jwtMiddleware } = require("../../../middleware/jwt.middleware");
    globals_1.jest
        .mocked(jwtMiddleware)
        .mockImplementation((req, res, next) => {
        req.user = { id: "user-id-123" };
        next();
    });
});
(0, globals_1.describe)("GET /boosters", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner 200 avec la liste des boosters disponibles", async () => {
            globals_1.jest.mocked(boosterService.fetchBoosters).mockResolvedValue({
                ok: true,
                value: mockBoosters,
            });
            const res = await (0, supertest_1.default)(app).get("/boosters");
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(Array.isArray(res.body)).toBe(true);
            (0, globals_1.expect)(res.body[0].name).toBe("Booster Série 1");
        });
        (0, globals_1.it)("devrait retourner les propriétés attendues des boosters", async () => {
            globals_1.jest.mocked(boosterService.fetchBoosters).mockResolvedValue({
                ok: true,
                value: mockBoosters,
            });
            const res = await (0, supertest_1.default)(app).get("/boosters");
            (0, globals_1.expect)(res.body[0].id).toBeDefined();
            (0, globals_1.expect)(res.body[0].quantity).toBe(0);
            (0, globals_1.expect)(res.body[0].price).toBe(100);
        });
    });
    (0, globals_1.describe)("authentification", () => {
        (0, globals_1.it)("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
            const { jwtMiddleware } = require("../../../middleware/jwt.middleware");
            globals_1.jest
                .mocked(jwtMiddleware)
                .mockImplementationOnce((req, res, next) => {
                req.user = undefined;
                next();
            });
            const res = await (0, supertest_1.default)(app).get("/boosters");
            (0, globals_1.expect)(res.status).toBe(401);
            (0, globals_1.expect)(res.body.error).toBe("UNAUTHORIZED");
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner 404 si une erreur BDD survient côté service", async () => {
            globals_1.jest.mocked(boosterService.fetchBoosters).mockResolvedValue({
                ok: false,
                error: "DATABASE_ERROR",
            });
            const res = await (0, supertest_1.default)(app).get("/boosters");
            (0, globals_1.expect)(res.status).toBe(404);
            (0, globals_1.expect)(res.body.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=get.booster.route.test.js.map