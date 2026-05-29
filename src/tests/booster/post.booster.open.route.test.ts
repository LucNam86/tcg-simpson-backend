import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/user/user.post";
import * as boosterService from "@services/booster";

jest.mock("@services/booster");
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

const mockCards = [
  {
    id: "card-id-1",
    name: "Homer Simpson",
    slug: "homer",
    type: "Personnage",
    rarity: "3",
    ATK: 60,
    PV: 140,
    description: "Père de famille",
    serie: { id_serie: { id: "serie-id-1", name: "Série 1", total: 40 }, position: 1 },
    family: { id: "family-id-1", name: "Simpson", description: "Famille Simpson", bonus: { ATK: 20, PV: 60 } },
    affinity: { id: "affinity-id-1", name: "Homer et Marge", description: "Duo", bonus: { ATK: 0, PV: 80 } },
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  const { jwtMiddleware } = require("@middleware/jwt.middleware");
  jest.mocked(jwtMiddleware).mockImplementation((req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  });
});

describe("POST /users/me/boosters/:boosterId/open", () => {
  describe("succès", () => {
    it("devrait retourner 200 avec les cartes obtenues", async () => {
      jest.mocked(boosterService.openBooster).mockResolvedValue({
        ok: true,
        value: mockCards as any,
      });

      const res = await request(app)
        .post("/users/me/boosters/booster-id-123/open");

      expect(res.status).toBe(200);
      expect(res.body.cards).toBeDefined();
      expect(res.body.cards).toHaveLength(1);
    });

    it("devrait retourner les données des cartes correctement", async () => {
      jest.mocked(boosterService.openBooster).mockResolvedValue({
        ok: true,
        value: mockCards as any,
      });

      const res = await request(app)
        .post("/users/me/boosters/booster-id-123/open");

      expect(res.body.cards[0].name).toBe("Homer Simpson");
      expect(res.body.cards[0].rarity).toBe("3");
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
        .post("/users/me/boosters/booster-id-123/open");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("UNAUTHORIZED");
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 404 si le booster n'est pas trouvé", async () => {
      jest.mocked(boosterService.openBooster).mockResolvedValue({
        ok: false,
        error: "BOOSTER_NOT_FOUND",
      });

      const res = await request(app)
        .post("/users/me/boosters/booster-id-123/open");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("BOOSTER_NOT_FOUND");
    });

    it("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
      jest.mocked(boosterService.openBooster).mockResolvedValue({
        ok: false,
        error: "USER_NOT_FOUND",
      });

      const res = await request(app)
        .post("/users/me/boosters/booster-id-123/open");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner 404 si aucun booster n'est disponible", async () => {
      jest.mocked(boosterService.openBooster).mockResolvedValue({
        ok: false,
        error: "NO_BOOSTER_AVAILABLE",
      });

      const res = await request(app)
        .post("/users/me/boosters/booster-id-123/open");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("NO_BOOSTER_AVAILABLE");
    });

    it("devrait retourner 404 si une erreur BDD survient", async () => {
      jest.mocked(boosterService.openBooster).mockResolvedValue({
        ok: false,
        error: "DATABASE_ERROR",
      });

      const res = await request(app)
        .post("/users/me/boosters/booster-id-123/open");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("DATABASE_ERROR");
    });
  });
});