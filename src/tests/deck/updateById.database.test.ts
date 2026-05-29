import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import { updateById } from "@database/methods/deck/deck.updateById"
import { DeckModel } from "@database/models/deck.model";

let mongoServer: MongoMemoryServer;

const mockUserId = new mongoose.Types.ObjectId();
const mockDeckId = new mongoose.Types.ObjectId();

// Génération de tableaux d'IDs factices pour les tests de cartes
const tenValidCardIds = Array.from({ length: 10 }, () => new mongoose.Types.ObjectId().toString());
const invalidCardIds = [new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString()];

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await DeckModel.deleteMany({});
  jest.restoreAllMocks();
});

describe("updateById (Integration)", () => {
  describe("succès", () => {
    it("devrait modifier uniquement le nom du deck avec succès", async () => {
      // 1. Création d'un deck initial
      await DeckModel.create({
        _id: mockDeckId,
        user: mockUserId,
        name: "Ancien Nom",
        cards: [],
        isActive: false,
      } as any);

      // 2. Mise à jour du nom uniquement
      const result = await updateById(mockUserId.toString(), mockDeckId.toString(), {
        name: "Nouveau Nom de Deck",
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.name).toBe("Nouveau Nom de Deck");
      }

      // 3. Vérification en base de données
      const deckEnBdd = await DeckModel.findById(mockDeckId);
      expect(deckEnBdd?.name).toBe("Nouveau Nom de Deck");
    });

    it("devrait modifier les cartes si le tableau contient exactement 10 éléments", async () => {
      await DeckModel.create({
        _id: mockDeckId,
        user: mockUserId,
        name: "Deck de Test",
        cards: [],
        isActive: false,
      } as any);

      const result = await updateById(mockUserId.toString(), mockDeckId.toString(), {
        cards: tenValidCardIds,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.cards).toHaveLength(10);
        expect(result.value.cards[0].toString()).toBe(tenValidCardIds[0]);
      }

      const deckEnBdd = await DeckModel.findById(mockDeckId);
      expect(deckEnBdd?.cards).toHaveLength(10);
    });
  });

  describe("erreurs de validation métier", () => {
    it("devrait retourner DECK_NOT_FOUND si le deck n'existe pas", async () => {
      const fakeDeckId = new mongoose.Types.ObjectId().toString();

      const result = await updateById(mockUserId.toString(), fakeDeckId, { name: "Nouveau" });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DECK_NOT_FOUND");
      }
    });

    it("devrait retourner UNAUTHORIZED_DECK si le deck appartient à un autre utilisateur", async () => {
      const unAutreUserId = new mongoose.Types.ObjectId();

      await DeckModel.create({
        _id: mockDeckId,
        user: unAutreUserId, // Créé par quelqu'un d'autre
        name: "Deck Privé",
        cards: [],
        isActive: false,
      } as any);

      // mockUserId essaie d'éditer le deck de unAutreUserId
      const result = await updateById(mockUserId.toString(), mockDeckId.toString(), {
        name: "Tentative de Hack",
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("UNAUTHORIZED_DECK");
      }

      // Sécurité : Vérifie que le nom n'a pas bougé en BDD
      const deckEnBdd = await DeckModel.findById(mockDeckId);
      expect(deckEnBdd?.name).toBe("Deck Privé");
    });

    it("devrait retourner INVALID_CARD_COUNT si le tableau de cartes fourni n'a pas une taille de 10", async () => {
      await DeckModel.create({
        _id: mockDeckId,
        user: mockUserId,
        name: "Deck Stable",
        cards: [],
        isActive: false,
      } as any);

      // Envoi de seulement 2 cartes au lieu de 10
      const result = await updateById(mockUserId.toString(), mockDeckId.toString(), {
        cards: invalidCardIds,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("INVALID_CARD_COUNT");
      }

      // Sécurité : Vérifie que le tableau de cartes est resté vide en BDD
      const deckEnBdd = await DeckModel.findById(mockDeckId);
      expect(deckEnBdd?.cards).toHaveLength(0);
    });
  });

  describe("erreurs techniques", () => {
    it("devrait capter l'exception et renvoyer DATABASE_ERROR en cas de crash Mongoose", async () => {
      // Force DeckModel.findById à jeter une erreur pour activer le bloc catch
      jest.spyOn(DeckModel, "findById").mockImplementationOnce(() => {
        throw new Error("Simulated database failure");
      });

      // Cache la sortie console.error dans le terminal de test
      jest.spyOn(console, "error").mockImplementation(() => {});

      const result = await updateById(mockUserId.toString(), mockDeckId.toString(), { name: "Test" });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
      expect(console.error).toHaveBeenCalled();
    });
  });
});