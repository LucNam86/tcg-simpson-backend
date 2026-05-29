import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/user/user.post";
import * as registerService from "@services/authentication/user.register";

jest.mock("@services/authentication/user.register");
jest.mock("@middleware/jwt.middleware", () => ({
  signToken: jest.fn().mockReturnValue("mock-token"),
  jwtMiddleware: jest.fn((req: any, res: any, next: any) => next()),
}));

const app = express();
app.use(express.json());
app.use("/users", router);

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

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /users/register", () => {
  describe("succès", () => {
    it("devrait retourner 201 avec token et données utilisateur", async () => {
      jest.mocked(registerService.registerUser).mockResolvedValue({
        ok: true,
        value: mockPublicUser,
      });

      const res = await request(app).post("/users/register").send(validBody);

      expect(res.status).toBe(201);
      expect(res.body.token).toBe("mock-token");
      expect(res.body.pseudo).toBe("TestUser");
      expect(res.body.email).toBe("test@example.com");
    });

    it("ne devrait pas retourner l'id dans la réponse", async () => {
      jest.mocked(registerService.registerUser).mockResolvedValue({
        ok: true,
        value: mockPublicUser,
      });

      const res = await request(app).post("/users/register").send(validBody);

      expect(res.body.id).toBeUndefined();
    });
  });

  describe("validation Zod", () => {
    it("devrait retourner 400 si le body est vide", async () => {
      const res = await request(app).post("/users/register").send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("EMAIL_INVALID");
    });

    it("devrait retourner 400 si l'email est invalide", async () => {
      const res = await request(app)
        .post("/users/register")
        .send({ ...validBody, email: "not-an-email" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("EMAIL_INVALID");
    });

    it("devrait retourner 400 si le pseudo est manquant", async () => {
      const res = await request(app)
        .post("/users/register")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("EMAIL_INVALID");
    });

    it("devrait retourner 400 si le mot de passe est manquant", async () => {
      const res = await request(app)
        .post("/users/register")
        .send({ pseudo: "TestUser", email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("EMAIL_INVALID");
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 409 si l'email est déjà pris", async () => {
      jest.mocked(registerService.registerUser).mockResolvedValue({
        ok: false,
        error: "EMAIL_TAKEN",
      });

      const res = await request(app).post("/users/register").send(validBody);

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("EMAIL_TAKEN");
    });

    it("devrait retourner 409 si le pseudo est déjà pris", async () => {
      jest.mocked(registerService.registerUser).mockResolvedValue({
        ok: false,
        error: "PSEUDO_TAKEN",
      });

      const res = await request(app).post("/users/register").send(validBody);

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("PSEUDO_TAKEN");
    });

    it("devrait retourner 400 pour les autres erreurs", async () => {
      jest.mocked(registerService.registerUser).mockResolvedValue({
        ok: false,
        error: "USER_CREATION_FAILED",
      });

      const res = await request(app).post("/users/register").send(validBody);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("USER_CREATION_FAILED");
    });
  });
});