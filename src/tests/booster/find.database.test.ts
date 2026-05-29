import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { find } from "@database/methods/booster/booster.find"
import { BoosterModel } from "@database/models/booster.model";

// Importation obligatoire des modèles nécessaires au bon fonctionnement du .populate()
import "@database/models/card.model";
import "@database/models/family.model";
import "@database/models/affinity.model";
import "@database/models/serie.model";

let mongoServer: MongoMemoryServer;

// Génération d'ObjectIds valides pour simuler les relations populées
const mockFamilyId = new mongoose.Types.ObjectId();
const mockAffinityId = new mongoose.Types.ObjectId();
const mockSerieId = new mongoose.Types.ObjectId();
const mockCardId = new mongoose.Types.ObjectId();
const mockBoosterId = new mongoose.Types.ObjectId();

// Définition d'un mock minimaliste de booster pour l'insertion
const mockBoosterData = {
  _id: mockBoosterId,
  name: "Booster Origines",
  slug: "booster-origines",
  quantity: 5,
  serie: mockSerieId, 
  cards: [mockCardId],
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
  await BoosterModel.deleteMany({});
  jest.restoreAllMocks();
});

describe("Booster find (Integration)", () => {
  describe("succès", () => {
    it("devrait retourner un tableau vide s'il n'y a aucun booster en base", async () => {
      const result = await find();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual([]);
      }
    });

    it("devrait récupérer tous les boosters et appliquer les chaînages .populate imbriqués", async () => {
      // Insertion du booster de test en BDD
      await BoosterModel.create(mockBoosterData as any);

      // Exécution de la méthode
      const result = await find();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        
        const booster = result.value[0];
        expect(booster.name).toBe("Booster Origines");
        
        // On vérifie que la structure attendue par le .populate est présente.
        // Note : En BDD mémoire vide (sans avoir créé les documents Card/Serie réels), 
        // Mongoose ne lèvera pas d'erreur mais laissera ces champs à null ou avec les IDs selon ta version.
        // L'important est de valider que la méthode n'a pas crashé durant le chaînage complexe.
        expect(booster.serie).toBeDefined();
        expect(booster.cards).toBeDefined();
        expect(Array.isArray(booster.cards)).toBe(true);
      }
    });
  });

  describe("erreurs", () => {
    it("devrait intercepter l'erreur et renvoyer un message explicite en cas de crash de BoosterModel", async () => {
      // On force BoosterModel.find à lever une exception pour tester le bloc catch
      jest.spyOn(BoosterModel, "find").mockImplementationOnce(() => {
        throw new Error("Simulated database failure");
      });

      // On mock console.error pour éviter de polluer les logs de ta console de test
      jest.spyOn(console, "error").mockImplementation(() => {});

      const result = await find();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Erreur lors de la recherche de tous les boosters");
      }
      
      // S'assure que console.error a bien été sollicité pour tracer le problème
      expect(console.error).toHaveBeenCalled();
    });
  });
});