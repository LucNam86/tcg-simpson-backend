import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { activateDeck } from "@services/deck/deck.isActive"
import * as deckMethods from "@database/methods/deck/deck.updateActiveDeck";
import { ok, err } from "@shared/Result";

// Mock de la dépendance de base de données
jest.mock("@database/methods/deck/deck.updateActiveDeck");

describe("activateDeck", () => {
  const userId = "user-123";
  const deckId = "deck-456";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("succès", () => {
    it("devrait activer le deck avec succès et retourner void (undefined)", async () => {
      // Simulation d'une mise à jour réussie en BDD
      jest.mocked(deckMethods.updateActiveDeck).mockResolvedValue(ok(undefined));

      const result = await activateDeck(userId, deckId);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBeUndefined();
      }
      
      // On s'assure que la fonction BDD a été appelée avec les bons paramètres
      expect(deckMethods.updateActiveDeck).toHaveBeenCalledWith(userId, deckId);
    });
  });

  describe("erreurs", () => {
    it("devrait retourner DECK_NOT_FOUND si la méthode BDD renvoie cette erreur", async () => {
      jest.mocked(deckMethods.updateActiveDeck).mockResolvedValue(
        err("DECK_NOT_FOUND" as any)
      );

      const result = await activateDeck(userId, deckId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DECK_NOT_FOUND");
      }
    });

    it("devrait retourner UNAUTHORIZED_DECK si la méthode BDD détecte que le deck n'appartient pas à l'utilisateur", async () => {
      jest.mocked(deckMethods.updateActiveDeck).mockResolvedValue(
        err("UNAUTHORIZED_DECK" as any)
      );

      const result = await activateDeck(userId, deckId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("UNAUTHORIZED_DECK");
      }
    });

    it("devrait retourner DATABASE_ERROR pour toute autre erreur technique non spécifiée", async () => {
      jest.mocked(deckMethods.updateActiveDeck).mockResolvedValue(
        err("RANDOM_MONGO_CRASH" as any)
      );

      const result = await activateDeck(userId, deckId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
    });
  });
});