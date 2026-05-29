import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { findAllCards } from "@database/methods/card/card.find";
import { CardModel } from "@database/models/card.model";

// Importation des modèles requis pour tester le .populate()
import "@database/models/family.model";
import "@database/models/affinity.model";
import "@database/models/serie.model";

let mongoServer: MongoMemoryServer;

// Génération d'ObjectIds valides pour simuler les relations populées
const mockFamilyId = new mongoose.Types.ObjectId();
const mockAffinityId = new mongoose.Types.ObjectId();
const mockSerieId = new mongoose.Types.ObjectId();

// "as const" permet de verrouiller les types littéraux (ex: type: "Personnage" au lieu de type: string)
const validCard = {
  name: "Dragon Blanc",
  slug: "dragon-blanc",
  description: "Un monstre mythique",
  rarity: "3",
  type: "Personnage", 
  PV: 3000,
  ATK: 2500,
  family: mockFamilyId,
  affinity: mockAffinityId,
  serie: {
    id_serie: mockSerieId,
    position: 1,
  },
} as const;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await CardModel.deleteMany({});
  jest.restoreAllMocks();
});

describe("findAllCards", () => {
  describe("succès", () => {
    it("devrait retourner un tableau vide si aucune carte n'existe", async () => {
      const result = await findAllCards();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual([]);
      }
    });

    it("devrait retourner toutes les cartes présentes en base de données", async () => {
      await CardModel.create(validCard);
      
      // FIX : On passe un slug unique ("magicien-sombre") pour éviter le conflit d'unicité en BDD
      await CardModel.create({ 
        ...validCard, 
        name: "Magicien Sombre",
        slug: "magicien-sombre" 
      });

      const result = await findAllCards();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0].name).toBe("Dragon Blanc");
        expect(result.value[1].name).toBe("Magicien Sombre");
      }
    });

    it("devrait appliquer les chaînages .populate sur les propriétés", async () => {
      await CardModel.create(validCard);

      const result = await findAllCards();

      expect(result.ok).toBe(true);
      if (result.ok) {
        const card = result.value[0];
        expect(card.family).toBeDefined();
        expect(card.affinity).toBeDefined();
        expect(card.serie).toBeDefined();
        expect(card.serie?.id_serie).toBeDefined();
      }
    });
  });

  describe("erreurs", () => {
    it("devrait intercepter l'erreur et renvoyer un message explicite en cas de crash de CardModel", async () => {
      jest.spyOn(CardModel, "find").mockImplementationOnce(() => {
        throw new Error("Simulated database failure");
      });

      jest.spyOn(console, "error").mockImplementation(() => {});

      const result = await findAllCards();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Erreur lors de la recherche de toutes les cartes");
      }
      expect(console.error).toHaveBeenCalled();
    });
  });
});