import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/user/user.post";
import * as cardService from "@services/card";

jest.mock("@services/card");
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

describe("POST /users/me/collection/sell", () => {
  describe("succès", () => {
    it("devrait retourner 200 avec earnedDonuts et money", async () => {
      jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
        ok: true,
        value: { earnedDonuts: 25, money: 125 },
      });

      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123", count: 1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.earnedDonuts).toBe(25);
      expect(res.body.money).toBe(125);
    });

    it("devrait appeler sellCollectionCards avec les bons arguments", async () => {
      jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
        ok: true,
        value: { earnedDonuts: 25, money: 125 },
      });

      await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123", count: 2 });

      expect(cardService.sellCollectionCards).toHaveBeenCalledWith(
        "user-id-123",
        "card-id-123",
        2
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

      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123", count: 1 });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("UNAUTHORIZED");
    });
  });

  describe("validation des inputs", () => {
    it("devrait retourner 400 si cardId est manquant", async () => {
      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ count: 1 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INPUT_INVALID");
    });

    it("devrait retourner 400 si count est manquant", async () => {
      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INPUT_INVALID");
    });

    it("devrait retourner 400 si count n'est pas un nombre", async () => {
      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123", count: "not-a-number" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INPUT_INVALID");
    });

    it("devrait retourner 400 si count est inférieur ou égal à 0", async () => {
      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123", count: 0 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INPUT_INVALID");
    });

    it("devrait retourner 400 si count est négatif", async () => {
      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123", count: -1 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INPUT_INVALID");
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
      jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
        ok: false,
        error: "USER_NOT_FOUND",
      });

      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123", count: 1 });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner 400 si la quantité est insuffisante", async () => {
      jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
        ok: false,
        error: "INSUFFICIENT_QUANTITY",
      });

      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123", count: 1 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("INSUFFICIENT_QUANTITY");
    });

    it("devrait retourner 500 pour DATABASE_ERROR", async () => {
      jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
        ok: false,
        error: "DATABASE_ERROR",
      });

      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123", count: 1 });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("SERVER_ERROR");
    });

    it("devrait retourner 500 pour SERVER_ERROR", async () => {
      jest.mocked(cardService.sellCollectionCards).mockResolvedValue({
        ok: false,
        error: "SERVER_ERROR",
      });

      const res = await request(app)
        .post("/users/me/collection/sell")
        .send({ cardId: "card-id-123", count: 1 });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("SERVER_ERROR");
    });
  });
});