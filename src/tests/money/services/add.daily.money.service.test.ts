import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { updateDailyMoney } from "@services/profile/profile.updateDailyMoney";
import * as userMethods from "@database/methods/user";
import * as updateMoneyMethods from "@database/methods/user/update/user.updateMoneyById";
import { ok, err } from "@shared/Result";

jest.mock("@database/methods/user");
jest.mock("@database/methods/user/update/user.updateMoneyById");

const mockUser = {
  _id: "user-id-123",
  pseudo: "TestUser",
  email: "test@example.com",
  money: 100,
  countdownEnds: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("updateDailyMoney", () => {
  describe("succès", () => {
    it("devrait retourner le nouveau solde et countdownEnds", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue(ok(200));
      jest.mocked(userMethods.updateById).mockResolvedValue(ok({} as any));

      const result = await updateDailyMoney("user-id-123");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.money).toBe(200);
        expect(result.value.countdownEnds).toBeDefined();
      }
    });

    it("devrait ajouter 100 donuts au solde existant", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue(ok(200));
      jest.mocked(userMethods.updateById).mockResolvedValue(ok({} as any));

      await updateDailyMoney("user-id-123");

      expect(updateMoneyMethods.updateMoneyById).toHaveBeenCalledWith(
        "user-id-123",
        200 // 100 + 100
      );
    });

    it("devrait fonctionner si countdownEnds est null", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(
        ok({ ...mockUser, countdownEnds: null } as any)
      );
      jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue(ok(200));
      jest.mocked(userMethods.updateById).mockResolvedValue(ok({} as any));

      const result = await updateDailyMoney("user-id-123");

      expect(result.ok).toBe(true);
    });

    it("devrait fonctionner si countdownEnds est dans le passé", async () => {
      const pastDate = new Date(Date.now() - 1000).toISOString();
      jest.mocked(userMethods.findById).mockResolvedValue(
        ok({ ...mockUser, countdownEnds: pastDate } as any)
      );
      jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue(ok(200));
      jest.mocked(userMethods.updateById).mockResolvedValue(ok({} as any));

      const result = await updateDailyMoney("user-id-123");

      expect(result.ok).toBe(true);
    });

    it("devrait mettre à jour countdownEnds à 12h dans le futur", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue(ok(200));
      jest.mocked(userMethods.updateById).mockResolvedValue(ok({} as any));

      const before = Date.now();
      await updateDailyMoney("user-id-123");
      const after = Date.now();

      const updateCall = jest.mocked(userMethods.updateById).mock.calls[0][1] as any;
      const countdownDate = new Date(updateCall.countdownEnds).getTime();

      const twelveHours = 12 * 60 * 60 * 1000;
      expect(countdownDate).toBeGreaterThanOrEqual(before + twelveHours - 100);
      expect(countdownDate).toBeLessThanOrEqual(after + twelveHours + 100);
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner NOT_READY si le cooldown n'est pas terminé", async () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      jest.mocked(userMethods.findById).mockResolvedValue(
        ok({ ...mockUser, countdownEnds: futureDate } as any)
      );

      const result = await updateDailyMoney("user-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("NOT_READY");
    });

    it("devrait retourner USER_NOT_FOUND si l'utilisateur est null", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(null as any));

      const result = await updateDailyMoney("user-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
    });
  });

  describe("erreurs base de données", () => {
    it("devrait retourner DATABASE_ERROR si findById échoue", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(err("DB_ERROR"));

      const result = await updateDailyMoney("user-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner DATABASE_ERROR si updateMoneyById échoue", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue(err("DB_ERROR"));

      const result = await updateDailyMoney("user-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner DATABASE_ERROR si updateById échoue", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(updateMoneyMethods.updateMoneyById).mockResolvedValue(ok(200));
      jest.mocked(userMethods.updateById).mockResolvedValue(err("DB_ERROR"));

      const result = await updateDailyMoney("user-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });
  });
});