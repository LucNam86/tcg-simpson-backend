import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { updateActiveDeck } from "@database/methods/deck/deck.updateActiveDeck"
import { DeckModel } from "@database/models/deck.model";

let mongoServer: MongoMemoryServer;

const mockUserId = new mongoose.Types.ObjectId();
const mockDeckId1 = new mongoose.Types.ObjectId();
const mockDeckId2 = new mongoose.Types.ObjectId();

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

describe("updateActiveDeck (Integration)", () => {
  describe("succès", () => {
    it("devrait activer le deck ciblé et désactiver tous les autres decks de l'utilisateur", async () => {
      // 1. Création d'un premier deck actuellement ACTIF
      await DeckModel.create({
        _id: mockDeckId1,
        user: mockUserId,
        name: "Deck Feu",
        cards: [],
        isActive: true,
      } as any);

      // 2. Création d'un deuxième deck actuellement INACTIF (celui qu'on va activer)
      await DeckModel.create({
        _id: mockDeckId2,
        user: mockUserId,
        name: "Deck Eau",
        cards: [],
        isActive: false,
      } as any);

      // 3. Appel de la fonction pour activer le Deck Eau (mockDeckId2)
      const result = await updateActiveDeck(mockUserId.toString(), mockDeckId2.toString());

      expect(result.ok).toBe(true);

      // 4. Vérification du basculement des états en base de données
      const deck1 = await DeckModel.findById(mockDeckId1);
      const deck2 = await DeckModel.findById(mockDeckId2);

      expect(deck1?.isActive).toBe(false); // Le premier deck a bien été désactivé par le updateMany
      expect(deck2?.isActive).toBe(true);  // Le deuxième deck est bien devenu le deck actif
    });
  });

  describe("erreurs de validation métier", () => {
    it("devrait retourner DECK_NOT_FOUND si le deck n'existe pas en base", async () => {
      const fakeDeckId = new mongoose.Types.ObjectId().toString();

      const result = await updateActiveDeck(mockUserId.toString(), fakeDeckId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DECK_NOT_FOUND");
      }
    });

    it("devrait retourner UNAUTHORIZED_DECK si le deck appartient à un autre utilisateur", async () => {
      const unAutreUserId = new mongoose.Types.ObjectId();

      // On crée un deck lié à un autre utilisateur
      await DeckModel.create({
        _id: mockDeckId1,
        user: unAutreUserId,
        name: "Deck Secret",
        cards: [],
        isActive: false,
      } as any);

      // mockUserId tente d'activer le deck appartenant à unAutreUserId
      const result = await updateActiveDeck(mockUserId.toString(), mockDeckId1.toString());

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("UNAUTHORIZED_DECK");
      }

      // Sécurité : On vérifie que le statut du deck n'a pas bougé
      const deckEnBdd = await DeckModel.findById(mockDeckId1);
      expect(deckEnBdd?.isActive).toBe(false);
    });
  });

  describe("erreurs techniques", () => {
    it("devrait retourner DATABASE_ERROR si une opération Mongoose lève une exception", async () => {
      // On force DeckModel.findById à crash pour déclencher le bloc catch
      jest.spyOn(DeckModel, "findById").mockImplementationOnce(() => {
        throw new Error("Simulated database failure");
      });

      // On cache les logs console.error pour le terminal de test
      jest.spyOn(console, "error").mockImplementation(() => {});

      const result = await updateActiveDeck(mockUserId.toString(), mockDeckId1.toString());

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
      expect(console.error).toHaveBeenCalled();
    });
  });
});