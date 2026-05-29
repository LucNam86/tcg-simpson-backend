import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { openBooster } from "@services/booster/booster.open";
import * as userMethods from "@database/methods/user";
import * as cardMapper from "@database/mapper/card.mapper";
import { ok, err } from "@shared/Result";

jest.mock("@database/methods/user");
jest.mock("@database/mapper/card.mapper");

const mockCard = {
  _id: "card-id-1",
  name: "Homer Simpson",
  slug: "homer",
  rarity: "3",
  type: "Personnage",
  family: { _id: "family-id-1", name: "Simpson", description: "Famille", bonus: { ATK: 20, PV: 60 } },
  affinity: { _id: "affinity-id-1", name: "Homer et Marge", description: "Duo", bonus: { ATK: 0, PV: 80 } },
  serie: { id_serie: { _id: "serie-id-1", name: "Série 1", total: 40 }, position: 1 },
};

const mockMappedCard = {
  id: "card-id-1",
  name: "Homer Simpson",
  slug: "homer",
  rarity: "3",
  type: "Personnage",
  ATK: 60,
  PV: 140,
  description: "Père de famille",
  family: { id: "family-id-1", name: "Simpson", description: "Famille", bonus: { ATK: 20, PV: 60 } },
  affinity: { id: "affinity-id-1", name: "Homer et Marge", description: "Duo", bonus: { ATK: 0, PV: 80 } },
  serie: { id_serie: { id: "serie-id-1", name: "Série 1", total: 40 }, position: 1 },
};

const mockUserWithBooster = {
  _id: "user-id-123",
  boosters: [
    {
      booster: {
        _id: { toString: () => "booster-id-123" },
        name: "Booster Série 1",
        quantity: 5,
        probabilities: [
          { rarity: "Common", value: 70 },
          { rarity: "Rare", value: 25 },
          { rarity: "Legendary", value: 5 },
        ],
        cards: [mockCard, mockCard, mockCard, mockCard, mockCard],
      },
      number: 1,
    },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(cardMapper.mapCard).mockReturnValue(mockMappedCard as any);
});

describe("openBooster", () => {
  describe("succès", () => {
    it("devrait retourner des cartes mappées", async () => {
      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(
        ok(mockUserWithBooster as any)
      );
      jest.mocked(userMethods.saveCardsToCollection).mockResolvedValue(ok(undefined));

      const result = await openBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(5);
        expect(result.value[0]).toEqual(mockMappedCard);
      }
    });

    it("devrait appeler saveCardsToCollection", async () => {
      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(
        ok(mockUserWithBooster as any)
      );
      jest.mocked(userMethods.saveCardsToCollection).mockResolvedValue(ok(undefined));

      await openBooster("user-id-123", "booster-id-123");

      expect(userMethods.saveCardsToCollection).toHaveBeenCalledWith(
        "user-id-123",
        "booster-id-123",
        expect.any(Array)
      );
    });

    it("devrait retourner le bon nombre de cartes selon la quantité du booster", async () => {
      const mockUserWith3Cards = {
        ...mockUserWithBooster,
        boosters: [{
          ...mockUserWithBooster.boosters[0],
          booster: {
            ...mockUserWithBooster.boosters[0].booster,
            quantity: 3,
          },
        }],
      };

      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(
        ok(mockUserWith3Cards as any)
      );
      jest.mocked(userMethods.saveCardsToCollection).mockResolvedValue(ok(undefined));

      const result = await openBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toHaveLength(3);
    });
  });

  describe("erreurs", () => {
    it("devrait retourner DATABASE_ERROR si findByIdWithBoosters échoue", async () => {
      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(err("DB_ERROR"));

      const result = await openBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner USER_NOT_FOUND si l'utilisateur est null", async () => {
      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(ok(null as any));

      const result = await openBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner BOOSTER_NOT_FOUND si le booster n'est pas dans la liste", async () => {
      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(
        ok(mockUserWithBooster as any)
      );

      const result = await openBooster("user-id-123", "wrong-booster-id");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("BOOSTER_NOT_FOUND");
    });

    it("devrait retourner NO_BOOSTER_AVAILABLE si le nombre est 0", async () => {
      const mockUserWithEmptyBooster = {
        ...mockUserWithBooster,
        boosters: [{
          ...mockUserWithBooster.boosters[0],
          number: 0,
        }],
      };

      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(
        ok(mockUserWithEmptyBooster as any)
      );

      const result = await openBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("NO_BOOSTER_AVAILABLE");
    });

    it("devrait retourner DATABASE_ERROR si saveCardsToCollection échoue", async () => {
      jest.mocked(userMethods.findByIdWithBoosters).mockResolvedValue(
        ok(mockUserWithBooster as any)
      );
      jest.mocked(userMethods.saveCardsToCollection).mockResolvedValue(err("DB_ERROR"));

      const result = await openBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });
  });
});