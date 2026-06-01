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
const user_post_1 = __importDefault(require("../../routes/user/user.post"));
const connectService = __importStar(require("../../services/authentication/user.connect"));
globals_1.jest.mock("@services/authentication/user.connect");
globals_1.jest.mock("@middleware/jwt.middleware", () => ({
    signToken: globals_1.jest.fn().mockReturnValue("mock-token"),
    jwtMiddleware: globals_1.jest.fn((req, res, next) => next()),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/users", user_post_1.default);
const validBody = {
    email: "test@example.com",
    password: "password123",
};
const mockPublicUser = {
    id: "user-id-123",
    pseudo: "TestUser",
    email: "test@example.com",
    avatar: "/avatars/avatar-1.webp",
    money: 100,
    darkMode: false,
    countdownEnds: new Date(),
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
});
(0, globals_1.describe)("POST /users/connect", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner 201 avec token et données utilisateur", async () => {
            globals_1.jest.mocked(connectService.connectUser).mockResolvedValue({
                ok: true,
                value: mockPublicUser,
            });
            const res = await (0, supertest_1.default)(app).post("/users/connect").send(validBody);
            (0, globals_1.expect)(res.status).toBe(201);
            (0, globals_1.expect)(res.body.token).toBe("mock-token");
            (0, globals_1.expect)(res.body.pseudo).toBe("TestUser");
            (0, globals_1.expect)(res.body.email).toBe("test@example.com");
        });
        (0, globals_1.it)("devrait retourner les données utilisateur complètes", async () => {
            globals_1.jest.mocked(connectService.connectUser).mockResolvedValue({
                ok: true,
                value: mockPublicUser,
            });
            const res = await (0, supertest_1.default)(app).post("/users/connect").send(validBody);
            (0, globals_1.expect)(res.body.money).toBe(100);
            (0, globals_1.expect)(res.body.avatar).toBe("/avatars/avatar-1.webp");
            (0, globals_1.expect)(res.body.darkMode).toBe(false);
        });
    });
    (0, globals_1.describe)("validation Zod", () => {
        (0, globals_1.it)("devrait retourner 400 si le body est vide", async () => {
            const res = await (0, supertest_1.default)(app).post("/users/connect").send({});
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("INPUT_INVALID");
        });
        (0, globals_1.it)("devrait retourner 400 si l'email est invalide", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/connect")
                .send({ ...validBody, email: "not-an-email" });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("INPUT_INVALID");
        });
        (0, globals_1.it)("devrait retourner 400 si le mot de passe est manquant", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/connect")
                .send({ email: "test@example.com" });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("INPUT_INVALID");
        });
        (0, globals_1.it)("devrait retourner 400 si l'email est manquant", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/connect")
                .send({ password: "password123" });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("INPUT_INVALID");
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner 400 si les credentials sont inconnus", async () => {
            globals_1.jest.mocked(connectService.connectUser).mockResolvedValue({
                ok: false,
                error: "CREDENTIALS_UNKNOWN",
            });
            const res = await (0, supertest_1.default)(app).post("/users/connect").send(validBody);
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("CREDENTIALS_UNKNOWN");
        });
        (0, globals_1.it)("devrait retourner 400 si le mot de passe est incorrect", async () => {
            globals_1.jest.mocked(connectService.connectUser).mockResolvedValue({
                ok: false,
                error: "WRONG_CREDENTIALS",
            });
            const res = await (0, supertest_1.default)(app).post("/users/connect").send(validBody);
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("WRONG_CREDENTIALS");
        });
        (0, globals_1.it)("devrait retourner 400 si une erreur BDD survient", async () => {
            globals_1.jest.mocked(connectService.connectUser).mockResolvedValue({
                ok: false,
                error: "DATABASE_ERROR",
            });
            const res = await (0, supertest_1.default)(app).post("/users/connect").send(validBody);
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=post.connect.route.test.js.map