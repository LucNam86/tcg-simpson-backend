import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/booster/booster.get";
import * as boosterService from "@services/booster/booster.fetch";

jest.mock("@services/booster/booster.fetch");
jest.mock("@middleware/jwt.middleware", () => ({
  jwtMiddleware: jest.fn((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use("/boosters", router);

const mockBoosters = [
  {
    id: "booster-1",
    name: "Booster Série 1",
    price: 100,
    slug: "booster-serie-1",
    quantity: 0, 
    cards: [],
    serie: {
      id_serie: "serie-id-123",
      position: 1,
    },
    probabilities: {
      normal: 70,
      rare: 25,
      legendary: 5,
    },
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  const { jwtMiddleware } = require("@middleware/jwt.middleware");
  jest
    .mocked(jwtMiddleware)
    .mockImplementation((req: any, res: any, next: any) => {
      req.user = { id: "user-id-123" };
      next();
    });
});

describe("GET /boosters", () => {
  describe("succès", () => {
    it("devrait retourner 200 avec la liste des boosters disponibles", async () => {
      jest.mocked(boosterService.fetchBoosters).mockResolvedValue({
        ok: true,
        value: mockBoosters as any, 
      });

      const res = await request(app).get("/boosters");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].name).toBe("Booster Série 1");
    });

    it("devrait retourner les propriétés attendues des boosters", async () => {
      jest.mocked(boosterService.fetchBoosters).mockResolvedValue({
        ok: true,
        value: mockBoosters as any,
      });

      const res = await request(app).get("/boosters");

      expect(res.body[0].id).toBeDefined();
      expect(res.body[0].quantity).toBe(0);
      expect(res.body[0].price).toBe(100);
    });
  });

  describe("authentification", () => {
    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      const { jwtMiddleware } = require("@middleware/jwt.middleware");
      jest
        .mocked(jwtMiddleware)
        .mockImplementationOnce((req: any, res: any, next: any) => {
          req.user = undefined;
          next();
        });

      const res = await request(app).get("/boosters");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("UNAUTHORIZED");
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 404 si une erreur BDD survient côté service", async () => {
      jest.mocked(boosterService.fetchBoosters).mockResolvedValue({
        ok: false,
        error: "DATABASE_ERROR",
      });

      const res = await request(app).get("/boosters");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("DATABASE_ERROR");
    });
  });
});
