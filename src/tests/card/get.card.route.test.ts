import request from "supertest";
import express from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import router from "@routes/card/card.get";
import * as cardService from "@services/card/card.fetch";
import { ok, err } from "@shared/Result";

// Mock du service
jest.mock("@services/card/card.fetch");

// Configuration de l'application Express pour le test
const app = express();
app.use(express.json());
app.use("/cards", router);

const mockCards = [
  {
    id: "card-1",
    name: "Dragon Blanc",
    rarity: "Légendaire",
    type: "Dragon",
    serie: "Set de Base",
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /cards", () => {
  describe("succès", () => {
    it("devrait retourner 200 avec la liste des cartes sans filtres", async () => {
      jest.mocked(cardService.fetchCards).mockResolvedValue(ok(mockCards as any));

      const res = await request(app).get("/cards");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCards);
      expect(cardService.fetchCards).toHaveBeenCalledWith({
        q: undefined,
        rarity: [],
        type: [],
        serie: [],
      });
    });

    it("devrait formater correctement les query params simples en tableaux (toArray)", async () => {
      jest.mocked(cardService.fetchCards).mockResolvedValue(ok(mockCards as any));

      // On envoie des strings simples dans l'URL (?rarity=Légendaire&type=Dragon)
      const res = await request(app)
        .get("/cards")
        .query({ q: "Dragon", rarity: "Légendaire", type: "Dragon", serie: "Set de Base" });

      expect(res.status).toBe(200);
      // On vérifie que le service reçoit bien des tableaux grâce à la fonction de conversion interne
      expect(cardService.fetchCards).toHaveBeenCalledWith({
        q: "Dragon",
        rarity: ["Légendaire"],
        type: ["Dragon"],
        serie: ["Set de Base"],
      });
    });

    it("devrait transmettre les query params s'ils sont déjà fournis sous forme de tableaux", async () => {
      jest.mocked(cardService.fetchCards).mockResolvedValue(ok([]));

      // Format tableau supporté par Express (?rarity=Rare&rarity=Épique)
      await request(app)
        .get("/cards")
        .query("rarity=Rare&rarity=Épique");

      expect(cardService.fetchCards).toHaveBeenCalledWith({
        q: undefined,
        rarity: ["Rare", "Épique"],
        type: [],
        serie: [],
      });
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner 404 si le service renvoie NO_CARDS", async () => {
      jest.mocked(cardService.fetchCards).mockResolvedValue(err("NO_CARDS"));

      const res = await request(app).get("/cards");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "NO_CARDS" });
    });

    it("devrait retourner 404 si le service renvoie DATABASE_ERROR", async () => {
      jest.mocked(cardService.fetchCards).mockResolvedValue(err("DATABASE_ERROR"));

      const res = await request(app).get("/cards");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "DATABASE_ERROR" });
    });
  });
});