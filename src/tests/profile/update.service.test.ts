import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { updateUser } from "@services/profile/profile.update";
import * as userMethods from "@database/methods/user";
import { ok, err } from "@shared/Result";
import bcrypt from "bcrypt";

jest.mock("@database/methods/user");
jest.mock("bcrypt");

const mockUpdatedUser = {
  pseudo: "UpdatedUser",
  money: 100,
  passwordHash: "hashed-password",
  email: "test@example.com",
  avatar: "/avatars/avatar-1.webp",
  darkMode: false,
  countdownEnds: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(bcrypt.hash).mockResolvedValue("new-hashed-password" as never);
});

describe("updateUser", () => {
  describe("succès", () => {
    it("devrait mettre à jour le pseudo", async () => {
      jest.mocked(userMethods.updateById).mockResolvedValue(ok(mockUpdatedUser as any));

      const result = await updateUser("user-id-123", { pseudo: "UpdatedUser" });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.pseudo).toBe("UpdatedUser");
        expect(result.value.money).toBe(100);
      }
    });

    it("devrait hasher le mot de passe avant de mettre à jour", async () => {
      jest.mocked(userMethods.updateById).mockResolvedValue(ok(mockUpdatedUser as any));

      await updateUser("user-id-123", { password: "newpassword123" });

      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", expect.any(Number));
      expect(userMethods.updateById).toHaveBeenCalledWith(
        "user-id-123",
        expect.objectContaining({ passwordHash: "new-hashed-password" })
      );
    });

    it("devrait mettre à jour l'avatar", async () => {
      jest.mocked(userMethods.updateById).mockResolvedValue(ok(mockUpdatedUser as any));

      await updateUser("user-id-123", { avatar: "/avatars/avatar-2.webp" });

      expect(userMethods.updateById).toHaveBeenCalledWith(
        "user-id-123",
        expect.objectContaining({ avatar: "/avatars/avatar-2.webp" })
      );
    });

    it("ne devrait pas inclure le password en clair dans la mise à jour", async () => {
      jest.mocked(userMethods.updateById).mockResolvedValue(ok(mockUpdatedUser as any));

      await updateUser("user-id-123", { password: "newpassword123" });

      const updateCall = jest.mocked(userMethods.updateById).mock.calls[0][1];
      expect((updateCall as any).password).toBeUndefined();
    });

    it("ne devrait pas appeler updateById avec des champs vides", async () => {
      jest.mocked(userMethods.updateById).mockResolvedValue(ok(mockUpdatedUser as any));

      await updateUser("user-id-123", {});

      expect(userMethods.updateById).toHaveBeenCalledWith("user-id-123", {});
    });
  });

  describe("erreurs métier", () => {
    it("devrait retourner USER_NOT_FOUND si la valeur retournée est null", async () => {
      jest.mocked(userMethods.updateById).mockResolvedValue(ok(null as any));

      const result = await updateUser("user-id-123", { pseudo: "UpdatedUser" });

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner PSEUDO_ALREADY_USED si le pseudo est déjà utilisé", async () => {
      jest.mocked(userMethods.updateById).mockResolvedValue(err("PSEUDO_ALREADY_USED"));

      const result = await updateUser("user-id-123", { pseudo: "ExistingUser" });

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("PSEUDO_ALREADY_USED");
    });

    it("devrait retourner DATABASE_ERROR pour les autres erreurs BDD", async () => {
      jest.mocked(userMethods.updateById).mockResolvedValue(err("DB_ERROR"));

      const result = await updateUser("user-id-123", { pseudo: "UpdatedUser" });

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });
  });
});