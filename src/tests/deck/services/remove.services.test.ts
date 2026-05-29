import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { removeUserDeck } from "@services/deck/deck.remove";
import * as deckMethods from "@database/methods/deck";
import { ok, err } from "@shared/Result";

// Mock de la dépendance de base de données
jest.mock("@database/methods/deck");

describe("removeUserDeck", () => {
  const userId = "user-123";
  const deckId = "deck-789";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("succès", () => {
    it("devrait supprimer le deck avec succès et retourner void (undefined)", async () => {
      // Simulation d'une suppression réussie en BDD
      jest.mocked(deckMethods.deleteDeck).mockResolvedValue(ok(undefined));

      const result = await removeUserDeck(userId, deckId);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBeUndefined();
      }
      
      // On s'assure que la fonction BDD a bien été appelée avec les bons paramètres
      expect(deckMethods.deleteDeck).toHaveBeenCalledWith(userId, deckId);
    });
  });

  describe("erreurs", () => {
    it("devrait retourner DECK_NOT_FOUND si la méthode BDD renvoie cette erreur", async () => {
      jest.mocked(deckMethods.deleteDeck).mockResolvedValue(
        err("DECK_NOT_FOUND" as any)
      );

      const result = await removeUserDeck(userId, deckId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DECK_NOT_FOUND");
      }
    });

    it("devrait retourner UNAUTHORIZED_DECK si le deck n'appartient pas à l'utilisateur", async () => {
      jest.mocked(deckMethods.deleteDeck).mockResolvedValue(
        err("UNAUTHORIZED_DECK" as any)
      );

      const result = await removeUserDeck(userId, deckId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("UNAUTHORIZED_DECK");
      }
    });

    it("devrait retourner DATABASE_ERROR pour n'importe quelle autre erreur technique", async () => {
      jest.mocked(deckMethods.deleteDeck).mockResolvedValue(
        err("MOCK_MONGO_CRASH" as any)
      );

      const result = await removeUserDeck(userId, deckId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
    });
  });
});