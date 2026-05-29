import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { sellCollectionCards } from "@services/card/card.sell";
import * as userMethods from "@database/methods/user";
import * as userMoneyMethods from "@database/methods/user/update/user.updateMoneyById";
import { ok, err } from "@shared/Result";

// Mock des dépendances externes
jest.mock("@database/methods/user");
jest.mock("@database/methods/user/update/user.updateMoneyById");

describe("sellCollectionCards", () => {
  const userId = "user-123";
  const cardIdToSell = "card-rare";

  // Des cartes de mock réutilisables
  const mockRareCard = { _id: "card-rare", rarity: "2", name: "Super Dragon" };
  const mockCommonCard = { _id: "card-common", rarity: "1", name: "Gobelin" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("succès", () => {
    it("devrait vendre une carte avec succès, mettre à jour la collection et le solde", async () => {
      // L'utilisateur possède 2 fois la carte rare (quantité suffisante pour en vendre 1)
      const mockUserDoc = {
        _id: userId,
        money: 100,
        myCollection: [mockRareCard, mockRareCard, mockCommonCard],
      };

      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(ok(mockUserDoc as any));
      jest.mocked(userMethods.updateById).mockResolvedValue(ok({} as any));
      // updateMoneyById renvoie la nouvelle valeur du solde (100 + 25 = 125)
      jest.mocked(userMoneyMethods.updateMoneyById).mockResolvedValue(ok(125));

      const result = await sellCollectionCards(userId, cardIdToSell, 1);

      expect(result.ok).toBe(true);
      if (result.ok) {
        // Rareté "2" vaut 25. 25 * 1 = 25 donuts gagnés
        expect(result.value).toEqual({
          earnedDonuts: 25,
          money: 125,
        });
      }

      // Vérifie qu'on a retiré exactement UNE instance de la carte vendue
      expect(userMethods.updateById).toHaveBeenCalledWith(userId, {
        myCollection: ["card-rare", "card-common"] as any[],
      });

      // Vérifie qu'on a mis à jour l'argent avec le bon montant calculé
      expect(userMoneyMethods.updateMoneyById).toHaveBeenCalledWith(userId, 125);
    });

    it("devrait utiliser le prix par défaut (5) si la rareté n'est pas dans la liste", async () => {
      const mockUnknownRarityCard = { _id: "card-unknown", rarity: "999", name: "Mystère" };
      const mockUserDoc = {
        _id: userId,
        money: 50,
        myCollection: [mockUnknownRarityCard, mockUnknownRarityCard],
      };

      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(ok(mockUserDoc as any));
      jest.mocked(userMethods.updateById).mockResolvedValue(ok({} as any));
      jest.mocked(userMoneyMethods.updateMoneyById).mockResolvedValue(ok(55));

      const result = await sellCollectionCards(userId, "card-unknown", 1);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.earnedDonuts).toBe(5); // Prix par défaut
      }
    });
  });

  describe("erreurs de validation et métier", () => {
    it("devrait retourner INSUFFICIENT_QUANTITY si la carte n'est pas dans la collection", async () => {
      const mockUserDoc = {
        _id: userId,
        myCollection: [mockCommonCard],
      };
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(ok(mockUserDoc as any));

      const result = await sellCollectionCards(userId, cardIdToSell, 1);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("INSUFFICIENT_QUANTITY");
      }
    });

    it("devrait retourner INSUFFICIENT_QUANTITY si le joueur essaie de vendre toutes ses cartes (doit en rester au moins 1)", async () => {
      // Le joueur possède 2 cartes, mais veut en vendre 2. 2 - 2 < 1 -> Erreur
      const mockUserDoc = {
        _id: userId,
        myCollection: [mockRareCard, mockRareCard],
      };
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(ok(mockUserDoc as any));

      const result = await sellCollectionCards(userId, cardIdToSell, 2);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("INSUFFICIENT_QUANTITY");
      }
    });
  });

  describe("erreurs techniques / serveurs", () => {
    it("devrait retourner DATABASE_ERROR si findByIdWithCollection échoue", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(err("DB_ERROR" as any));

      const result = await sellCollectionCards(userId, cardIdToSell, 1);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
    });

    it("devrait retourner USER_NOT_FOUND si l'utilisateur n'existe pas", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(ok(null as any));

      const result = await sellCollectionCards(userId, cardIdToSell, 1);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("USER_NOT_FOUND");
      }
    });

    it("devrait retourner SERVER_ERROR si updateById (collection) échoue", async () => {
      const mockUserDoc = {
        _id: userId,
        myCollection: [mockRareCard, mockRareCard],
      };
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(ok(mockUserDoc as any));
      // Simulation du crash de la mise à jour de la collection
      jest.mocked(userMethods.updateById).mockResolvedValue(err("DB_UPDATE_ERROR" as any));

      const result = await sellCollectionCards(userId, cardIdToSell, 1);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("SERVER_ERROR");
      }
    });

    it("devrait retourner SERVER_ERROR si updateMoneyById (argent) échoue", async () => {
      const mockUserDoc = {
        _id: userId,
        myCollection: [mockRareCard, mockRareCard],
      };
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(ok(mockUserDoc as any));
      jest.mocked(userMethods.updateById).mockResolvedValue(ok({} as any));
      // Simulation du crash du portefeuille
      jest.mocked(userMoneyMethods.updateMoneyById).mockResolvedValue(err("MONEY_ERROR" as any));

      const result = await sellCollectionCards(userId, cardIdToSell, 1);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("SERVER_ERROR");
      }
    });
  });
});