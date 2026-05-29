import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/user/user.put";
import * as boosterService from "@services/booster/booster.add";

jest.mock("@services/booster/booster.add");
jest.mock("@middleware/jwt.middleware", () => ({
  jwtMiddleware: jest.fn((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use("/users", router);

beforeEach(() => {
  jest.clearAllMocks();
  const { jwtMiddleware } = require("@middleware/jwt.middleware");
  jest.mocked(jwtMiddleware).mockImplementation((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  });
});

describe("PUT /users/me/boosters/:boosterId", () => {
  describe("succès", () => {
    it("devrait retourner 200 avec success true et le nouveau solde", async () => {
      jest.mocked(boosterService.addBooster).mockResolvedValue({
        ok: true,
        value: { money: 50 },
      });

      const res = await request(app).put("/users/me/boosters/booster-id-123");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.money).toBe(50);
    });

    it("devrait appeler addBooster avec le bon userId et boosterId", async () => {
      jest.mocked(boosterService.addBooster).mockResolvedValue({
        ok: true,
        value: { money: 50 },
      });

      await request(app).put("/users/me/boosters/booster-id-123");

      expect(boosterService.addBooster).toHaveBeenCalledWith(
        "user-id-123",
        "booster-id-123"
      );
    });
  });

  describe("authentification", () => {
    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      const { jwtMiddleware } = require("@middleware/jwt.middleware");
      jest.mocked(jwtMiddleware).mockImplementationOnce((req: any, res: any, next: any) => {
        req.user = undefined;
        next();
      });

      const res = await request(app).put("/users/me/boosters/booster-id-123");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("UNAUTHORIZED");
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
      jest.mocked(boosterService.addBooster).mockResolvedValue({
        ok: false,
        error: "USER_NOT_FOUND",
      });

      const res = await request(app).put("/users/me/boosters/booster-id-123");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner 404 si le booster n'est pas trouvé", async () => {
      jest.mocked(boosterService.addBooster).mockResolvedValue({
        ok: false,
        error: "BOOSTER_NOT_FOUND",
      });

      const res = await request(app).put("/users/me/boosters/booster-id-123");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("BOOSTER_NOT_FOUND");
    });

    it("devrait retourner 400 si l'utilisateur n'a pas assez de money", async () => {
      jest.mocked(boosterService.addBooster).mockResolvedValue({
        ok: false,
        error: "NOT_ENOUGH_MONEY",
      });

      const res = await request(app).put("/users/me/boosters/booster-id-123");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("NOT_ENOUGH_MONEY");
    });

    it("devrait retourner 500 pour les autres erreurs", async () => {
      jest.mocked(boosterService.addBooster).mockResolvedValue({
        ok: false,
        error: "DATABASE_ERROR",
      });

      const res = await request(app).put("/users/me/boosters/booster-id-123");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DATABASE_ERROR");
    });
  });
});