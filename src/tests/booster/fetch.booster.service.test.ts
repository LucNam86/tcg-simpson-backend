import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { fetchBoosters } from "@services/booster/booster.fetch";
import * as boosterMethods from "@database/methods/booster";
import * as boosterMapper from "@database/mapper/booster.mapper";
import { ok, err } from "@shared/Result";

jest.mock("@database/methods/booster");
jest.mock("@database/mapper/booster.mapper");

const mockPopulatedBoosters = [
  {
    _id: "booster-id-123",
    name: "Booster Série 1",
    price: 100,
    slug: "booster-serie-1",
    quantity: 5,
    probabilities: [
      { rarity: "Common", value: 70 },
      { rarity: "Rare", value: 25 },
      { rarity: "Legendary", value: 5 },
    ],
    cards: [],
    serie: {
      _id: "serie-id-123",
      name: "Série 1",
    },
  },
];

const mockMappedBooster = {
  id: "booster-id-123",
  name: "Booster Série 1",
  price: 100,
  slug: "booster-serie-1",
  quantity: 5,
  probabilities: [
    { rarity: "Common", value: 70 },
    { rarity: "Rare", value: 25 },
    { rarity: "Legendary", value: 5 },
  ],
  cards: [],
  serie: {
    id_serie: "serie-id-123",
    position: 1,
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .mocked(boosterMapper.mapBooster)
    .mockReturnValue(mockMappedBooster as any);
});

describe("fetchBoosters", () => {
  describe("succès", () => {
    it("devrait retourner la liste des boosters mappés avec un résultat ok", async () => {
      jest
        .mocked(boosterMethods.find)
        .mockResolvedValue(ok(mockPopulatedBoosters as any));

      const result = await fetchBoosters();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]).toEqual(mockMappedBooster);
        expect(result.value[0].name).toBe("Booster Série 1");
      }
    });

    it("devrait appeler le mapper pour chaque booster trouvé", async () => {
      jest
        .mocked(boosterMethods.find)
        .mockResolvedValue(ok(mockPopulatedBoosters as any));

      await fetchBoosters();

      expect(boosterMapper.mapBooster).toHaveBeenCalledTimes(1);
      expect(boosterMapper.mapBooster).toHaveBeenCalledWith(
        mockPopulatedBoosters[0] as any,
      );
    });

    it("devrait retourner un tableau vide si aucun booster n'est en BDD", async () => {
      jest.mocked(boosterMethods.find).mockResolvedValue(ok([]));

      const result = await fetchBoosters();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(0);
      }
    });
  });

  describe("erreurs", () => {
    it("devrait retourner DATABASE_ERROR si la méthode find() échoue", async () => {
      jest
        .mocked(boosterMethods.find)
        .mockResolvedValue(
          err("Erreur lors de la recherche de tous les boosters"),
        );

      const result = await fetchBoosters();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
    });

    it("devrait retourner UNKNOWN_BOOSTER si la méthode find() renvoie une valeur null ou undefined", async () => {
      jest.mocked(boosterMethods.find).mockResolvedValue(ok(null as any));

      const result = await fetchBoosters();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("UNKNOWN_BOOSTER");
      }
    });
  });
});
