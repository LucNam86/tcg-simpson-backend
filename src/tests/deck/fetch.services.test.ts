import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { fetchUserDecks } from "@services/deck/deck.fetch";
import * as userMethods from "@database/methods/user";
import * as deckMapper from "@database/mapper/deck.mapper";
import { ok, err } from "@shared/Result";

// Mock des dépendances externes
jest.mock("@database/methods/user");
jest.mock("@database/mapper/deck.mapper");

describe("fetchUserDecks", () => {
  const userId = "user-id-123";

  // Mocks de données pour les tests
  const mockDecksBDD = [
    { _id: "deck-1", name: "Deck Feu", isActive: true, cards: [] },
    { _id: "deck-2", name: "Deck Eau", isActive: false, cards: [] }
  ];

  const mockUserWithDecks = {
    _id: userId,
    decks: mockDecksBDD,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Par défaut, mapDeck retourne le deck mocké pré-formaté pour simplifier les assertions
    jest.mocked(deckMapper.mapDeck).mockImplementation((deck: any) => ({
      id: deck._id,
      name: deck.name,
      isActive: deck.isActive,
      cards: deck.cards,
    }));
  });

  describe("succès", () => {
    it("devrait retourner la liste des decks mappés de l'utilisateur", async () => {
      // Simulation d'une réponse positive de la BDD
      jest.mocked(userMethods.findByIdWithDecks).mockResolvedValue(
        ok(mockUserWithDecks as any)
      );

      const result = await fetchUserDecks(userId);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0]).toEqual({
          id: "deck-1",
          name: "Deck Feu",
          isActive: true,
          cards: [],
        });
      }
      // On s'assure que le mapper a bien été appelé pour chaque deck
      expect(deckMapper.mapDeck).toHaveBeenCalledTimes(2);
    });

    it("devrait retourner un tableau vide si l'utilisateur n'a aucun deck", async () => {
      jest.mocked(userMethods.findByIdWithDecks).mockResolvedValue(
        ok({ _id: userId, decks: [] } as any)
      );

      const result = await fetchUserDecks(userId);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual([]);
      }
    });
  });

  describe("erreurs", () => {
    it("devrait propager USER_NOT_FOUND si la méthode BDD renvoie cette erreur spécifique", async () => {
      // Simulation du cas où findByIdWithDecks renvoie explicitement USER_NOT_FOUND
      jest.mocked(userMethods.findByIdWithDecks).mockResolvedValue(
        err("USER_NOT_FOUND" as any)
      );

      const result = await fetchUserDecks(userId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("USER_NOT_FOUND");
      }
    });

    it("devrait retourner DATABASE_ERROR pour n'importe quel autre échec de la BDD", async () => {
      // Simulation d'un crash générique ou d'une autre erreur de connexion
      jest.mocked(userMethods.findByIdWithDecks).mockResolvedValue(
        err("UNKNOWN_MONGO_ERROR" as any)
      );

      const result = await fetchUserDecks(userId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
    });
  });
});