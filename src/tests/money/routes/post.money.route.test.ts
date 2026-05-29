import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/user/user.post";
import * as profileService from "@services/profile";

jest.mock("@services/profile");
jest.mock("@middleware/jwt.middleware", () => ({
  signToken: jest.fn().mockReturnValue("mock-token"),
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

describe("POST /users/me/money", () => {
  describe("succès", () => {
    it("devrait retourner 200 avec le nouveau solde pour pack-50", async () => {
      jest.mocked(profileService.addMoney).mockResolvedValue({
        ok: true,
        value: 150,
      });

      const res = await request(app)
        .post("/users/me/money")
        .send({ packId: "pack-50" });

      expect(res.status).toBe(200);
      expect(res.body.money).toBe(150);
    });

    it("devrait retourner 200 avec le nouveau solde pour pack-200", async () => {
      jest.mocked(profileService.addMoney).mockResolvedValue({
        ok: true,
        value: 300,
      });

      const res = await request(app)
        .post("/users/me/money")
        .send({ packId: "pack-200" });

      expect(res.status).toBe(200);
      expect(res.body.money).toBe(300);
    });

    it("devrait appeler addMoney avec le bon userId et le bon montant", async () => {
      jest.mocked(profileService.addMoney).mockResolvedValue({
        ok: true,
        value: 150,
      });

      await request(app)
        .post("/users/me/money")
        .send({ packId: "pack-50" });

      expect(profileService.addMoney).toHaveBeenCalledWith("user-id-123", 50);
    });

    it("devrait appeler addMoney avec le montant correct pour chaque pack", async () => {
      jest.mocked(profileService.addMoney).mockResolvedValue({
        ok: true,
        value: 1100,
      });

      await request(app)
        .post("/users/me/money")
        .send({ packId: "pack-1000" });

      expect(profileService.addMoney).toHaveBeenCalledWith("user-id-123", 1000);
    });
  });

  describe("authentification", () => {
    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      const { jwtMiddleware } = require("@middleware/jwt.middleware");
      jest.mocked(jwtMiddleware).mockImplementationOnce((req: any, res: any, next: any) => {
        req.user = undefined;
        next();
      });

      const res = await request(app)
        .post("/users/me/money")
        .send({ packId: "pack-50" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("UNAUTHORIZED");
    });
  });

  describe("validation des inputs", () => {
    it("devrait retourner 400 si packId est manquant", async () => {
      const res = await request(app)
        .post("/users/me/money")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INVALID_PACK");
    });

    it("devrait retourner 400 si packId est invalide", async () => {
      const res = await request(app)
        .post("/users/me/money")
        .send({ packId: "pack-9999" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INVALID_PACK");
    });

    it("devrait retourner 400 si packId est une chaîne vide", async () => {
      const res = await request(app)
        .post("/users/me/money")
        .send({ packId: "" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INVALID_PACK");
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
      jest.mocked(profileService.addMoney).mockResolvedValue({
        ok: false,
        error: "USER_NOT_FOUND",
      });

      const res = await request(app)
        .post("/users/me/money")
        .send({ packId: "pack-50" });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner 500 pour DATABASE_ERROR", async () => {
      jest.mocked(profileService.addMoney).mockResolvedValue({
        ok: false,
        error: "DATABASE_ERROR",
      });

      const res = await request(app)
        .post("/users/me/money")
        .send({ packId: "pack-50" });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DATABASE_ERROR");
    });
  });
});