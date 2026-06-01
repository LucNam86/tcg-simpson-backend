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
const user_put_1 = __importDefault(require("../../../routes/user/user.put"));
const updateService = __importStar(require("../../../services/profile"));
globals_1.jest.mock("@services/profile");
globals_1.jest.mock("@middleware/jwt.middleware", () => ({
    jwtMiddleware: globals_1.jest.fn((req, res, next) => {
        req.user = { id: "user-id-123" };
        next();
    }),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/users", user_put_1.default);
const mockUpdatedUser = {
    pseudo: "UpdatedUser",
    money: 100,
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
    const { jwtMiddleware } = require("../../../middleware/jwt.middleware");
    globals_1.jest.mocked(jwtMiddleware).mockImplementation((req, res, next) => {
        req.user = { id: "user-id-123" };
        next();
    });
});
(0, globals_1.describe)("PUT /users/me/profile", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait retourner 200 avec les données mises à jour", async () => {
            globals_1.jest.mocked(updateService.updateUser).mockResolvedValue({
                ok: true,
                value: mockUpdatedUser,
            });
            const res = await (0, supertest_1.default)(app)
                .put("/users/me/profile")
                .send({ pseudo: "UpdatedUser" });
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body.pseudo).toBe("UpdatedUser");
        });
        (0, globals_1.it)("devrait accepter une mise à jour du mot de passe", async () => {
            globals_1.jest.mocked(updateService.updateUser).mockResolvedValue({
                ok: true,
                value: mockUpdatedUser,
            });
            const res = await (0, supertest_1.default)(app)
                .put("/users/me/profile")
                .send({ password: "newpassword123" });
            (0, globals_1.expect)(res.status).toBe(200);
        });
        (0, globals_1.it)("devrait accepter une mise à jour de l'avatar", async () => {
            globals_1.jest.mocked(updateService.updateUser).mockResolvedValue({
                ok: true,
                value: mockUpdatedUser,
            });
            const res = await (0, supertest_1.default)(app)
                .put("/users/me/profile")
                .send({ avatar: "/avatars/avatar-2.webp" });
            (0, globals_1.expect)(res.status).toBe(200);
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
                .put("/users/me/profile")
                .send({ pseudo: "UpdatedUser" });
            (0, globals_1.expect)(res.status).toBe(401);
        });
    });
    (0, globals_1.describe)("validation Zod", () => {
        (0, globals_1.it)("devrait retourner 400 si le body est vide", async () => {
            const res = await (0, supertest_1.default)(app).put("/users/me/profile").send({});
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("No fields to update provided.");
        });
        (0, globals_1.it)("devrait retourner 400 si le pseudo est trop court", async () => {
            const res = await (0, supertest_1.default)(app)
                .put("/users/me/profile")
                .send({ pseudo: "ab" });
            (0, globals_1.expect)(res.status).toBe(400);
        });
        (0, globals_1.it)("devrait retourner 400 si le mot de passe est trop court", async () => {
            const res = await (0, supertest_1.default)(app)
                .put("/users/me/profile")
                .send({ password: "short" });
            (0, globals_1.expect)(res.status).toBe(400);
        });
    });
    (0, globals_1.describe)("erreurs métier", () => {
        (0, globals_1.it)("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
            globals_1.jest.mocked(updateService.updateUser).mockResolvedValue({
                ok: false,
                error: "USER_NOT_FOUND",
            });
            const res = await (0, supertest_1.default)(app)
                .put("/users/me/profile")
                .send({ pseudo: "UpdatedUser" });
            (0, globals_1.expect)(res.status).toBe(404);
            (0, globals_1.expect)(res.body.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner 400 si le pseudo est déjà utilisé", async () => {
            globals_1.jest.mocked(updateService.updateUser).mockResolvedValue({
                ok: false,
                error: "PSEUDO_ALREADY_USED",
            });
            const res = await (0, supertest_1.default)(app)
                .put("/users/me/profile")
                .send({ pseudo: "ExistingUser" });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("PSEUDO_ALREADY_USED");
        });
        (0, globals_1.it)("devrait retourner 400 pour les autres erreurs", async () => {
            globals_1.jest.mocked(updateService.updateUser).mockResolvedValue({
                ok: false,
                error: "DATABASE_ERROR",
            });
            const res = await (0, supertest_1.default)(app)
                .put("/users/me/profile")
                .send({ pseudo: "UpdatedUser" });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=put.update.route.test.js.map