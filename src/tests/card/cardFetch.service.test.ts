import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { fetchCards } from "@services/card/card.fetch";
import * as cardMethods from "@database/methods/card/card.find";
import * as cardMapper from "@database/mapper/card.mapper";
import { ok, err } from "@shared/Result";

// Mock des dépendances externes
jest.mock("@database/methods/card/card.find");
jest.mock("@database/mapper/card.mapper");

// Mocks de données pour les tests
const mockCards = [
  {
    id: "card-1",
    name: "Dragon Blanc",
    description: "Un monstre puissant",
    rarity: "Légendaire",
    type: "Dragon",
    family: { name: "Lumière" },
    affinity: { name: "Feu" },
    serie: { id_serie: { name: "Set de Base" } }
  },
  {
    id: "card-2",
    name: "Magicien Sombre",
    description: "Le maître des magies",
    rarity: "Épique",
    type: "Magicien",
    family: { name: "Ténèbres" },
    affinity: { name: "Eau" },
    serie: { id_serie: { name: "L'extension" } }
  }
];

beforeEach(() => {
  jest.clearAllMocks();
  // Par défaut, mapCard retourne la carte telle quelle pour simplifier les assertions
  jest.mocked(cardMapper.mapCard).mockImplementation((card) => card as any);
});

describe("fetchCards", () => {
  const emptyFilters = { q: "", rarity: [], type: [], serie: [] };

  describe("succès", () => {
    it("devrait retourner toutes les cartes mappées si aucun filtre n'est appliqué", async () => {
      jest.mocked(cardMethods.findAllCards).mockResolvedValue(
        ok(mockCards as any)
      );

      const result = await fetchCards(emptyFilters);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0]).toEqual(mockCards[0]);
      }
      expect(cardMapper.mapCard).toHaveBeenCalledTimes(2);
    });

    it("devrait filtrer les cartes par recherche textuelle (q)", async () => {
      jest.mocked(cardMethods.findAllCards).mockResolvedValue(
        ok(mockCards as any)
      );

      const result = await fetchCards({ ...emptyFilters, q: "bLaNc" });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].id).toBe("card-1");
      }
    });

    it("devrait filtrer les cartes par rareté", async () => {
      jest.mocked(cardMethods.findAllCards).mockResolvedValue(
        ok(mockCards as any)
      );

      const result = await fetchCards({ ...emptyFilters, rarity: ["Épique"] });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].id).toBe("card-2");
      }
    });

    it("devrait filtrer les cartes par type", async () => {
      jest.mocked(cardMethods.findAllCards).mockResolvedValue(
        ok(mockCards as any)
      );

      const result = await fetchCards({ ...emptyFilters, type: ["Dragon"] });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].id).toBe("card-1");
      }
    });

    it("devrait filtrer les cartes par série", async () => {
      jest.mocked(cardMethods.findAllCards).mockResolvedValue(
        ok(mockCards as any)
      );

      const result = await fetchCards({ ...emptyFilters, serie: ["L'extension"] });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].id).toBe("card-2");
      }
    });
  });

  describe("erreurs", () => {
    it("devrait retourner NO_CARDS si la valeur retournée est nulle ou indéfinie", async () => {
      jest.mocked(cardMethods.findAllCards).mockResolvedValue(
        ok(null as any)
      );

      const result = await fetchCards(emptyFilters);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("NO_CARDS");
      }
    });

    it("devrait retourner DATABASE_ERROR si la requête échoue", async () => {
      jest.mocked(cardMethods.findAllCards).mockResolvedValue(
        err("DB_ERROR" as any)
      );

      const result = await fetchCards(emptyFilters);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
    });
  });
});