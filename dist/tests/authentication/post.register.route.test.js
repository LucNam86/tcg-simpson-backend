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
const registerService = __importStar(require("../../services/authentication/user.register"));
globals_1.jest.mock("@services/authentication/user.register");
globals_1.jest.mock("@middleware/jwt.middleware", () => ({
    signToken: globals_1.jest.fn().mockReturnValue("mock-token"),
    jwtMiddleware: globals_1.jest.fn((req, res, next) => next()),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/users", user_post_1.default);
const validBody = {
    pseudo: "TestUser",
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
(0, globals_1.describe)("POST /users/register", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner 201 avec token et données utilisateur", async () => {
            globals_1.jest.mocked(registerService.registerUser).mockResolvedValue({
                ok: true,
                value: mockPublicUser,
            });
            const res = await (0, supertest_1.default)(app).post("/users/register").send(validBody);
            (0, globals_1.expect)(res.status).toBe(201);
            (0, globals_1.expect)(res.body.token).toBe("mock-token");
            (0, globals_1.expect)(res.body.pseudo).toBe("TestUser");
            (0, globals_1.expect)(res.body.email).toBe("test@example.com");
        });
        (0, globals_1.it)("ne devrait pas retourner l'id dans la réponse", async () => {
            globals_1.jest.mocked(registerService.registerUser).mockResolvedValue({
                ok: true,
                value: mockPublicUser,
            });
            const res = await (0, supertest_1.default)(app).post("/users/register").send(validBody);
            (0, globals_1.expect)(res.body.id).toBeUndefined();
        });
    });
    (0, globals_1.describe)("validation Zod", () => {
        (0, globals_1.it)("devrait retourner 400 si le body est vide", async () => {
            const res = await (0, supertest_1.default)(app).post("/users/register").send({});
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("EMAIL_INVALID");
        });
        (0, globals_1.it)("devrait retourner 400 si l'email est invalide", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/register")
                .send({ ...validBody, email: "not-an-email" });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("EMAIL_INVALID");
        });
        (0, globals_1.it)("devrait retourner 400 si le pseudo est manquant", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/register")
                .send({ email: "test@example.com", password: "password123" });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("EMAIL_INVALID");
        });
        (0, globals_1.it)("devrait retourner 400 si le mot de passe est manquant", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/users/register")
                .send({ pseudo: "TestUser", email: "test@example.com" });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("EMAIL_INVALID");
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner 409 si l'email est déjà pris", async () => {
            globals_1.jest.mocked(registerService.registerUser).mockResolvedValue({
                ok: false,
                error: "EMAIL_TAKEN",
            });
            const res = await (0, supertest_1.default)(app).post("/users/register").send(validBody);
            (0, globals_1.expect)(res.status).toBe(409);
            (0, globals_1.expect)(res.body.error).toBe("EMAIL_TAKEN");
        });
        (0, globals_1.it)("devrait retourner 409 si le pseudo est déjà pris", async () => {
            globals_1.jest.mocked(registerService.registerUser).mockResolvedValue({
                ok: false,
                error: "PSEUDO_TAKEN",
            });
            const res = await (0, supertest_1.default)(app).post("/users/register").send(validBody);
            (0, globals_1.expect)(res.status).toBe(409);
            (0, globals_1.expect)(res.body.error).toBe("PSEUDO_TAKEN");
        });
        (0, globals_1.it)("devrait retourner 400 pour les autres erreurs", async () => {
            globals_1.jest.mocked(registerService.registerUser).mockResolvedValue({
                ok: false,
                error: "USER_CREATION_FAILED",
            });
            const res = await (0, supertest_1.default)(app).post("/users/register").send(validBody);
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("USER_CREATION_FAILED");
        });
    });
});
//# sourceMappingURL=post.register.route.test.js.map