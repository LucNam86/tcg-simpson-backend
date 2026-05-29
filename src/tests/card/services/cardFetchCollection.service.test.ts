import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { fetchUserCollection } from "@services/card/card.fetchCollection";
import * as userMethods from "@database/methods/user";
import * as userMapper from "@database/mapper";
import { ok, err } from "@shared/Result";

// Mock des dépendances externes
jest.mock("@database/methods/user");
jest.mock("@database/mapper");

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

const mockPopulatedUser = {
  _id: "user-id-123",
  myCollection: mockCards,
};

// Par défaut, mapCard retourne la carte telle quelle pour simplifier les assertions
beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(userMapper.mapCard).mockImplementation((card) => card as any);
});

describe("fetchUserCollection", () => {
  const emptyFilters = { q: "", rarity: [], type: [], serie: [] };

  describe("succès", () => {
    it("devrait retourner la collection complète mappée si aucun filtre n'est appliqué", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        ok(mockPopulatedUser as any)
      );

      const result = await fetchUserCollection("user-id-123", emptyFilters);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0]).toEqual(mockCards[0]);
      }
      expect(userMapper.mapCard).toHaveBeenCalledTimes(2);
    });

    it("devrait filtrer la collection par recherche textuelle (q)", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        ok(mockPopulatedUser as any)
      );

      // Test de recherche insensible à la casse sur le nom
      const result = await fetchUserCollection("user-id-123", { ...emptyFilters, q: "mAgIcIeN" });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].id).toBe("card-2");
      }
    });

    it("devrait filtrer la collection par rareté", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        ok(mockPopulatedUser as any)
      );

      const result = await fetchUserCollection("user-id-123", { ...emptyFilters, rarity: ["Légendaire"] });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].id).toBe("card-1");
      }
    });

    it("devrait filtrer la collection par type", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        ok(mockPopulatedUser as any)
      );

      const result = await fetchUserCollection("user-id-123", { ...emptyFilters, type: ["Magicien"] });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].id).toBe("card-2");
      }
    });

    it("devrait filtrer la collection par série", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        ok(mockPopulatedUser as any)
      );

      const result = await fetchUserCollection("user-id-123", { ...emptyFilters, serie: ["Set de Base"] });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].id).toBe("card-1");
      }
    });

    it("devrait retourner un tableau vide si 'myCollection' est indéfinie", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        ok({ _id: "user-id-123" } as any) // Pas de champ myCollection
      );

      const result = await fetchUserCollection("user-id-123", emptyFilters);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual([]);
      }
    });
  });

  describe("erreurs", () => {
    it("devrait retourner USER_NOT_FOUND si le document utilisateur est null", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        ok(null as any)
      );

      const result = await fetchUserCollection("user-id-123", emptyFilters);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("USER_NOT_FOUND");
      }
    });

    it("devrait retourner DATABASE_ERROR si la requête à la base de données échoue", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        err("DB_ERROR" as any)
      );

      const result = await fetchUserCollection("user-id-123", emptyFilters);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
    });
  });
});