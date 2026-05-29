import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { addDeck } from "@services/deck/deck.add";
import * as userMethods from "@database/methods/user";
import * as deckMethods from "@database/methods/deck";
import { ok, err } from "@shared/Result";

// Mock des dépendances de la base de données
jest.mock("@database/methods/user");
jest.mock("@database/methods/deck");

describe("addDeck", () => {
  const userId = "user-123";
  const deckName = "Mon Deck de Feu";
  
  // Génération d'un tableau contenant exactement 10 IDs de cartes factices
  const validCards = Array.from({ length: 10 }, (_, i) => `card-id-${i}`);
  const invalidCards = ["card-1", "card-2"]; // Seulement 2 cartes

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("succès", () => {
    it("devrait créer un deck actif si c'est le premier deck de l'utilisateur", async () => {
      // L'utilisateur n'a aucun deck existant
      const mockUser = { _id: userId, decks: [] };
      const mockSavedDeck = { _id: "deck-789", name: deckName, isActive: true };

      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(deckMethods.saveDeck).mockResolvedValue(ok(mockSavedDeck as any));

      const result = await addDeck({ userId, name: deckName, cards: validCards });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual({
          id: "deck-789",
          name: deckName,
          isActive: true, // Doit être true car decks.length === 0
          cards: validCards,
        });
      }

      // Vérifie que saveDeck a été appelé avec les bons paramètres et isActive à true
      expect(deckMethods.saveDeck).toHaveBeenCalledWith({
        userId,
        name: deckName,
        cards: validCards,
        isActive: true,
      });
    });

    it("devrait créer un deck inactif si l'utilisateur possède déjà un deck", async () => {
      // L'utilisateur a déjà 1 deck
      const mockUser = { _id: userId, decks: ["existing-deck-id"] };
      const mockSavedDeck = { _id: "deck-789", name: deckName, isActive: false };

      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(deckMethods.saveDeck).mockResolvedValue(ok(mockSavedDeck as any));

      const result = await addDeck({ userId, name: deckName, cards: validCards });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.isActive).toBe(false); // Doit être false car l'utilisateur a déjà un deck
      }

      expect(deckMethods.saveDeck).toHaveBeenCalledWith({
        userId,
        name: deckName,
        cards: validCards,
        isActive: false,
      });
    });

    it("devrait assigner un nom par défaut si aucun nom n'est fourni", async () => {
      const mockUser = { _id: userId, decks: [] };
      const mockSavedDeck = { _id: "deck-789", name: "Mon Super Deck", isActive: true };

      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(deckMethods.saveDeck).mockResolvedValue(ok(mockSavedDeck as any));

      // On omet ou passe une chaîne vide pour le nom
      const result = await addDeck({ userId, name: "", cards: validCards });

      expect(result.ok).toBe(true);
      expect(deckMethods.saveDeck).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Mon Super Deck" })
      );
    });
  });

  describe("erreurs de validation et métier", () => {
    it("devrait retourner INVALID_CARD_COUNT si le deck n'a pas exactement 10 cartes", async () => {
      const result = await addDeck({ userId, name: deckName, cards: invalidCards });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("INVALID_CARD_COUNT");
      }
      // Le code doit bloquer avant même de chercher l'utilisateur en BDD
      expect(userMethods.findById).not.toHaveBeenCalled();
    });

    it("devrait retourner MAX_DECKS_REACHED si l'utilisateur possède déjà 3 decks ou plus", async () => {
      // Simulation d'un utilisateur au maximum de sa capacité de decks
      const mockUser = { _id: userId, decks: ["deck-1", "deck-2", "deck-3"] };
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));

      const result = await addDeck({ userId, name: deckName, cards: validCards });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("MAX_DECKS_REACHED");
      }
      expect(deckMethods.saveDeck).not.toHaveBeenCalled();
    });
  });

  describe("erreurs de base de données", () => {
    it("devrait retourner USER_NOT_FOUND si findById renvoie une valeur nulle", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(null as any));

      const result = await addDeck({ userId, name: deckName, cards: validCards });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("USER_NOT_FOUND");
      }
    });

    it("devrait retourner DATABASE_ERROR si findById échoue", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(err("DB_ERROR" as any));

      const result = await addDeck({ userId, name: deckName, cards: validCards });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
    });

    it("devrait retourner DATABASE_ERROR si saveDeck échoue", async () => {
      const mockUser = { _id: userId, decks: [] };
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(deckMethods.saveDeck).mockResolvedValue(err("SAVE_ERROR" as any));

      const result = await addDeck({ userId, name: deckName, cards: validCards });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
    });
  });
});