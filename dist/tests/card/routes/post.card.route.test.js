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
const cardService = __importStar(require("../../../services/card"));
globals_1.jest.mock("@services/card");
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
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    const { jwtMiddleware } = require("../../../middleware/jwt.middleware");
    globals_1.jest.mocked(jwtMiddleware).mockImplementation((req, res, next) => {
        req.user = { id: "user-id-123" };
        next();
    });
});
(0, globals_1.describe)("POST /users/me/collection/sell", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner 200 avec earnedDonuts et money", async () => {
            globals_1.jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
                ok: true,
                value: { earnedDonuts: 25, money: 125 },
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123", count: 1 });
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body.success).toBe(true);
            (0, globals_1.expect)(res.body.earnedDonuts).toBe(25);
            (0, globals_1.expect)(res.body.money).toBe(125);
        });
        (0, globals_1.it)("devrait appeler sellCollectionCards avec les bons arguments", async () => {
            globals_1.jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
                ok: true,
                value: { earnedDonuts: 25, money: 125 },
            });
            await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123", count: 2 });
            (0, globals_1.expect)(cardService.sellCollectionCards).toHaveBeenCalledWith("user-id-123", "card-id-123", 2);
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
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123", count: 1 });
            (0, globals_1.expect)(res.status).toBe(401);
            (0, globals_1.expect)(res.body.error).toBe("UNAUTHORIZED");
        });
    });
    (0, globals_1.describe)("validation des inputs", () => {
        (0, globals_1.it)("devrait retourner 400 si cardId est manquant", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ count: 1 });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("INPUT_INVALID");
        });
        (0, globals_1.it)("devrait retourner 400 si count est manquant", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123" });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("INPUT_INVALID");
        });
        (0, globals_1.it)("devrait retourner 400 si count n'est pas un nombre", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123", count: "not-a-number" });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("INPUT_INVALID");
        });
        (0, globals_1.it)("devrait retourner 400 si count est inférieur ou égal à 0", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123", count: 0 });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("INPUT_INVALID");
        });
        (0, globals_1.it)("devrait retourner 400 si count est négatif", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123", count: -1 });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("INPUT_INVALID");
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
            globals_1.jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
                ok: false,
                error: "USER_NOT_FOUND",
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123", count: 1 });
            (0, globals_1.expect)(res.status).toBe(404);
            (0, globals_1.expect)(res.body.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner 400 si la quantité est insuffisante", async () => {
            globals_1.jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
                ok: false,
                error: "INSUFFICIENT_QUANTITY",
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123", count: 1 });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("INSUFFICIENT_QUANTITY");
        });
        (0, globals_1.it)("devrait retourner 500 pour DATABASE_ERROR", async () => {
            globals_1.jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
                ok: false,
                error: "DATABASE_ERROR",
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123", count: 1 });
            (0, globals_1.expect)(res.status).toBe(500);
            (0, globals_1.expect)(res.body.error).toBe("SERVER_ERROR");
        });
        (0, globals_1.it)("devrait retourner 500 pour SERVER_ERROR", async () => {
            globals_1.jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
                ok: false,
                error: "SERVER_ERROR",
            });
            const res = await (0, supertest_1.default)(app)
                .post("/users/me/collection/sell")
                .send({ cardId: "card-id-123", count: 1 });
            (0, globals_1.expect)(res.status).toBe(500);
            (0, globals_1.expect)(res.body.error).toBe("SERVER_ERROR");
        });
    });
});
//# sourceMappingURL=post.card.route.test.js.map