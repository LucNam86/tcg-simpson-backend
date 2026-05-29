import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import { deleteDeck } from "@database/methods/deck/deck.delete"
import { DeckModel } from "@database/models/deck.model";
import { UserModel } from "@database/models/user.model";

let mongoServer: MongoMemoryServer;

// Préparation des IDs de tests
const mockUserId = new mongoose.Types.ObjectId();
const mockDeckId = new mongoose.Types.ObjectId();

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
  await UserModel.deleteMany({});
  jest.restoreAllMocks();
});

describe("deleteDeck (Integration)", () => {
  describe("succès", () => {
    it("devrait supprimer le deck et le retirer du tableau de l'utilisateur", async () => {
      // 1. Création d'un faux utilisateur possédant le deck dans sa liste
      // Note: On utilise "as any" ou "as const" pour contourner la validation stricte des champs du schéma si nécessaire
    await UserModel.create({
  _id: mockUserId,
  pseudo: "PlayerOne",
  email: "player@test.com",
  passwordHash: "hashed-password",
  avatar: "/avatars/avatar-1.webp",
  money: 100,
  countdownEnds: new Date(),
  myCollection: [],
  boosters: [],
  decks: [mockDeckId],
  darkMode: false,
});

      // 2. Création du deck lié à cet utilisateur
      await DeckModel.create({
        _id: mockDeckId,
        user: mockUserId,
        name: "Mon Deck de Test",
        cards: []
      } as any);

      // 3. Exécution de la fonction à tester
      const result = await deleteDeck(mockUserId.toString(), mockDeckId.toString());

      expect(result.ok).toBe(true);

      // 4. Vérifications en base de données
      const deckEnBdd = await DeckModel.findById(mockDeckId);
      expect(deckEnBdd).toBeNull(); // Le deck doit avoir disparu

      const userEnBdd = await UserModel.findById(mockUserId);
      expect(userEnBdd?.decks).not.toContainEqual(mockDeckId); // L'ID du deck doit être $pull de la liste
    });
  });

  describe("erreurs de validation métier", () => {
    it("devrait retourner DECK_NOT_FOUND si le deck n'existe pas", async () => {
      const fakeDeckId = new mongoose.Types.ObjectId().toString();

      const result = await deleteDeck(mockUserId.toString(), fakeDeckId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DECK_NOT_FOUND");
      }
    });

    it("devrait retourner UNAUTHORIZED_DECK si le deck appartient à un autre utilisateur", async () => {
      const unAutreUserId = new mongoose.Types.ObjectId();

      // Création d'un deck appartenant à "unAutreUserId"
      await DeckModel.create({
        _id: mockDeckId,
        user: unAutreUserId,
        name: "Deck Secret",
        cards: []
      } as any);

      // mockUserId essaie de supprimer le deck de unAutreUserId
      const result = await deleteDeck(mockUserId.toString(), mockDeckId.toString());

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("UNAUTHORIZED_DECK");
      }

      // Sécurité : On s'assure que le deck n'a pas été supprimé par erreur
      const deckEnBdd = await DeckModel.findById(mockDeckId);
      expect(deckEnBdd).not.toBeNull();
    });
  });

  describe("erreurs techniques", () => {
    it("devrait retourner DATABASE_ERROR si une méthode Mongoose crash", async () => {
      // Simulation d'une panne BDD sur DeckModel.findById
      jest.spyOn(DeckModel, "findById").mockImplementationOnce(() => {
        throw new Error("Simulated database failure");
      });

      // On cache le console.error dans le terminal de test
      jest.spyOn(console, "error").mockImplementation(() => {});

      const result = await deleteDeck(mockUserId.toString(), mockDeckId.toString());

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
      expect(console.error).toHaveBeenCalled();
    });
  });
});