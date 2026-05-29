import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/user/user.get";
import * as profileService from "@services/profile";

jest.mock("@services/profile");
jest.mock("@middleware/jwt.middleware", () => ({
  jwtMiddleware: jest.fn((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use("/users", router);

const mockProfile = {
  id: "user-id-123",
  pseudo: "TestUser",
  email: "test@example.com",
  avatar: "/avatars/avatar-1.webp",
  money: 100,
  darkMode: false,
  countdownEnds: new Date(),
  myCollection: [],
  boosters: [],
  decks: [],
  friends: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  const { jwtMiddleware } = require("@middleware/jwt.middleware");
  jest.mocked(jwtMiddleware).mockImplementation((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  });
});

describe("GET /users/me/profile", () => {
  describe("succès", () => {
    it("devrait retourner 200 avec le profil utilisateur", async () => {
      jest.mocked(profileService.fetchUserById).mockResolvedValue({
        ok: true,
        value: mockProfile,
      });

      const res = await request(app).get("/users/me/profile");

      expect(res.status).toBe(200);
      expect(res.body.pseudo).toBe("TestUser");
      expect(res.body.email).toBe("test@example.com");
    });

    it("devrait retourner les données complètes du profil", async () => {
      jest.mocked(profileService.fetchUserById).mockResolvedValue({
        ok: true,
        value: mockProfile,
      });

      const res = await request(app).get("/users/me/profile");

      expect(res.body.myCollection).toBeDefined();
      expect(res.body.boosters).toBeDefined();
      expect(res.body.decks).toBeDefined();
    });
  });

  describe("authentification", () => {
    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      const { jwtMiddleware } = require("@middleware/jwt.middleware");
      jest.mocked(jwtMiddleware).mockImplementationOnce((req: any, res: any, next: any) => {
        req.user = undefined;
        next();
      });

      const res = await request(app).get("/users/me/profile");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("UNAUTHORIZED");
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
      jest.mocked(profileService.fetchUserById).mockResolvedValue({
        ok: false,
        error: "USER_NOT_FOUND",
      });

      const res = await request(app).get("/users/me/profile");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner 404 si une erreur BDD survient", async () => {
      jest.mocked(profileService.fetchUserById).mockResolvedValue({
        ok: false,
        error: "DATABASE_ERROR",
      });

      const res = await request(app).get("/users/me/profile");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("DATABASE_ERROR");
    });
  });
});