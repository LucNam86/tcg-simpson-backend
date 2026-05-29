import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { addBooster } from "@services/booster/booster.add";
import * as userMethods from "@database/methods/user";
import * as boosterMethods from "@database/methods/booster/booster.findById";
import * as saveBoosterMethods from "@database/methods/booster/booster.save";
import * as updateMoneyMethods from "@database/methods/user/update/user.updateMoneyById";
import { ok, err } from "@shared/Result";

jest.mock("@database/methods/user");
jest.mock("@database/methods/booster/booster.findById");
jest.mock("@database/methods/booster/booster.save");
jest.mock("@database/methods/user/update/user.updateMoneyById");

const mockUser = {
  _id: "user-id-123",
  pseudo: "TestUser",
  email: "test@example.com",
  money: 100,
};

const mockBooster = {
  _id: "booster-id-123",
  name: "Booster Série 1",
  price: 50,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("addBooster", () => {
  describe("succès", () => {
    it("devrait retourner le nouveau solde après achat", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(boosterMethods.findById).mockResolvedValue(ok(mockBooster as any));
      jest.mocked(saveBoosterMethods.saveBoosterToUser).mockResolvedValue(ok(undefined));
      jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue(ok(50));

      const result = await addBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value.money).toBe(50);
    });

    it("devrait déduire le prix du booster de la money", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(boosterMethods.findById).mockResolvedValue(ok(mockBooster as any));
      jest.mocked(saveBoosterMethods.saveBoosterToUser).mockResolvedValue(ok(undefined));
      jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue(ok(50));

      await addBooster("user-id-123", "booster-id-123");

      expect(updateMoneyMethods.updateMoneyById).toHaveBeenCalledWith(
        "user-id-123",
        50 // 100 - 50
      );
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner USER_NOT_FOUND si l'utilisateur est null", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(null as any));

      const result = await addBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner BOOSTER_NOT_FOUND si le booster est null", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(boosterMethods.findById).mockResolvedValue(ok(null as any));

      const result = await addBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("BOOSTER_NOT_FOUND");
    });

    it("devrait retourner NOT_ENOUGH_MONEY si la money est insuffisante", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(
        ok({ ...mockUser, money: 10 } as any)
      );
      jest.mocked(boosterMethods.findById).mockResolvedValue(ok(mockBooster as any));

      const result = await addBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("NOT_ENOUGH_MONEY");
    });
  });

  describe("erreurs base de données", () => {
    it("devrait retourner DATABASE_ERROR si findById user échoue", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(err("DB_ERROR"));

      const result = await addBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner DATABASE_ERROR si findById booster échoue", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(boosterMethods.findById).mockResolvedValue(err("DB_ERROR"));

      const result = await addBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner DATABASE_ERROR si saveBoosterToUser échoue", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(boosterMethods.findById).mockResolvedValue(ok(mockBooster as any));
      jest.mocked(saveBoosterMethods.saveBoosterToUser).mockResolvedValue(err("DB_ERROR"));

      const result = await addBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner DATABASE_ERROR si updateMoneyById échoue", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(boosterMethods.findById).mockResolvedValue(ok(mockBooster as any));
      jest.mocked(saveBoosterMethods.saveBoosterToUser).mockResolvedValue(ok(undefined));
      jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue(err("DB_ERROR"));

      const result = await addBooster("user-id-123", "booster-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });
  });
});