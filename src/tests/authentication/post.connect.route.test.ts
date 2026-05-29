import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/user/user.post";
import * as connectService from "@services/authentication/user.connect";

jest.mock("@services/authentication/user.connect");
jest.mock("@middleware/jwt.middleware", () => ({
  signToken: jest.fn().mockReturnValue("mock-token"),
  jwtMiddleware: jest.fn((req: any, res: any, next: any) => next()),
}));

const app = express();
app.use(express.json());
app.use("/users", router);

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

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /users/connect", () => {
  describe("succès", () => {
    it("devrait retourner 201 avec token et données utilisateur", async () => {
      jest.mocked(connectService.connectUser).mockResolvedValue({
        ok: true,
        value: mockPublicUser,
      });

      const res = await request(app).post("/users/connect").send(validBody);

      expect(res.status).toBe(201);
      expect(res.body.token).toBe("mock-token");
      expect(res.body.pseudo).toBe("TestUser");
      expect(res.body.email).toBe("test@example.com");
    });

    it("devrait retourner les données utilisateur complètes", async () => {
      jest.mocked(connectService.connectUser).mockResolvedValue({
        ok: true,
        value: mockPublicUser,
      });

      const res = await request(app).post("/users/connect").send(validBody);

      expect(res.body.money).toBe(100);
      expect(res.body.avatar).toBe("/avatars/avatar-1.webp");
      expect(res.body.darkMode).toBe(false);
    });
  });

  describe("validation Zod", () => {
    it("devrait retourner 400 si le body est vide", async () => {
      const res = await request(app).post("/users/connect").send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INPUT_INVALID");
    });

    it("devrait retourner 400 si l'email est invalide", async () => {
      const res = await request(app)
        .post("/users/connect")
        .send({ ...validBody, email: "not-an-email" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INPUT_INVALID");
    });

    it("devrait retourner 400 si le mot de passe est manquant", async () => {
      const res = await request(app)
        .post("/users/connect")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INPUT_INVALID");
    });

    it("devrait retourner 400 si l'email est manquant", async () => {
      const res = await request(app)
        .post("/users/connect")
        .send({ password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INPUT_INVALID");
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 400 si les credentials sont inconnus", async () => {
      jest.mocked(connectService.connectUser).mockResolvedValue({
        ok: false,
        error: "CREDENTIALS_UNKNOWN",
      });

      const res = await request(app).post("/users/connect").send(validBody);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("CREDENTIALS_UNKNOWN");
    });

    it("devrait retourner 400 si le mot de passe est incorrect", async () => {
      jest.mocked(connectService.connectUser).mockResolvedValue({
        ok: false,
        error: "WRONG_CREDENTIALS",
      });

      const res = await request(app).post("/users/connect").send(validBody);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("WRONG_CREDENTIALS");
    });

    it("devrait retourner 400 si une erreur BDD survient", async () => {
      jest.mocked(connectService.connectUser).mockResolvedValue({
        ok: false,
        error: "DATABASE_ERROR",
      });

      const res = await request(app).post("/users/connect").send(validBody);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("DATABASE_ERROR");
    });
  });
});