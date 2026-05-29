import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { addMoney } from "@services/profile";
import * as userMethods from "@database/methods/user";
import { ok, err } from "@shared/Result";

jest.mock("@database/methods/user");

const mockUser = {
  _id: "user-id-123",
  pseudo: "TestUser",
  email: "test@example.com",
  money: 100,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("addMoney", () => {
  describe("succès", () => {
    it("devrait retourner le nouveau solde après ajout", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(userMethods.updateMoneyById).mockResolvedValue(ok(150));

      const result = await addMoney("user-id-123", 50);

      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(150);
    });

    it("devrait calculer le nouveau solde correctement", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(userMethods.updateMoneyById).mockResolvedValue(ok(300));

      await addMoney("user-id-123", 200);

      expect(userMethods.updateMoneyById).toHaveBeenCalledWith(
        "user-id-123",
        300 // 100 + 200
      );
    });

    it("devrait gérer un solde initial à 0", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(
        ok({ ...mockUser, money: 0 } as any)
      );
      jest.mocked(userMethods.updateMoneyById).mockResolvedValue(ok(50));

      await addMoney("user-id-123", 50);

      expect(userMethods.updateMoneyById).toHaveBeenCalledWith(
        "user-id-123",
        50
      );
    });
  });

  describe("erreurs", () => {
    it("devrait retourner USER_NOT_FOUND si l'utilisateur est null", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(null as any));

      const result = await addMoney("user-id-123", 50);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner DATABASE_ERROR si findById échoue", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(err("DB_ERROR"));

      const result = await addMoney("user-id-123", 50);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner DATABASE_ERROR si updateMoneyById échoue", async () => {
      jest.mocked(userMethods.findById).mockResolvedValue(ok(mockUser as any));
      jest.mocked(userMethods.updateMoneyById).mockResolvedValue(err("DB_ERROR"));

      const result = await addMoney("user-id-123", 50);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });
  });
});