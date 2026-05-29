import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { updateDeck } from "@services/deck/deck.update"
import * as deckMethods from "@database/methods/deck/deck.updateById";
import { ok, err } from "@shared/Result";
import { Types } from "mongoose";

// Mock de la dépendance de base de données
jest.mock("@database/methods/deck/deck.updateById");

describe("updateDeck", () => {
  const userId = "user-123";
  const deckId = "deck-456";

  // Simulation d'identifiants ObjectId de cartes retournés par Mongoose
  const cardId1 = new Types.ObjectId();
  const cardId2 = new Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("succès", () => {
    it("devrait mettre à jour le deck avec succès et formater la réponse", async () => {
      const updateInput = {
        name: "Nouveau Nom de Deck",
        cards: [cardId1.toString(), cardId2.toString()],
      };

      // Objet simulé retourné par la BDD après modification
      const mockUpdatedDeckDoc = {
        _id: deckId,
        name: "Nouveau Nom de Deck",
        isActive: true,
        cards: [cardId1, cardId2], // Mongoose stocke des ObjectIds
      };

      jest.mocked(deckMethods.updateById).mockResolvedValue(ok(mockUpdatedDeckDoc as any));

      const result = await updateDeck(userId, deckId, updateInput);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual({
          id: deckId,
          name: "Nouveau Nom de Deck",
          isActive: true,
          // Vérifie la conversion implicite des ObjectIds en string[]
          cards: [cardId1.toString(), cardId2.toString()],
        });
      }

      // Vérifie que la fonction BDD a bien reçu l'input d'origine
      expect(deckMethods.updateById).toHaveBeenCalledWith(userId, deckId, updateInput);
    });
  });

  describe("erreurs", () => {
    it("devrait retourner DECK_NOT_FOUND si la méthode BDD renvoie cette erreur", async () => {
      jest.mocked(deckMethods.updateById).mockResolvedValue(err("DECK_NOT_FOUND" as any));

      const result = await updateDeck(userId, deckId, { name: "Test" });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DECK_NOT_FOUND");
      }
    });

    it("devrait retourner UNAUTHORIZED_DECK si le deck n'appartient pas à l'utilisateur", async () => {
      jest.mocked(deckMethods.updateById).mockResolvedValue(err("UNAUTHORIZED_DECK" as any));

      const result = await updateDeck(userId, deckId, { name: "Test" });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("UNAUTHORIZED_DECK");
      }
    });

    it("devrait retourner INVALID_CARD_COUNT si le nombre de cartes n'est pas correct", async () => {
      jest.mocked(deckMethods.updateById).mockResolvedValue(err("INVALID_CARD_COUNT" as any));

      const result = await updateDeck(userId, deckId, { cards: ["1", "2"] });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("INVALID_CARD_COUNT");
      }
    });

    it("devrait retourner DATABASE_ERROR pour toute autre erreur technique", async () => {
      jest.mocked(deckMethods.updateById).mockResolvedValue(err("UNKNOWN_MONGO_CRASH" as any));

      const result = await updateDeck(userId, deckId, { name: "Test" });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
    });
  });
});