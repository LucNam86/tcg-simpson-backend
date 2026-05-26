import { updateUser } from "@services/user/update/user.update";
import { updateById } from "@database/methods/user";
import bcrypt from "bcrypt";

jest.mock("@database/methods/user");
jest.mock("bcrypt");
jest.mock("@config/env", () => ({
  env: { BCRYPT_SALT_ROUNDS: 10 },
}));

const mockToObject = (data: object) => ({
  toObject: jest.fn().mockReturnValue(data),
});

const mockUpdatedUser = {
  id: "user-123",
  pseudo: "NouveauPseudo",
  email: "luc@test.com",
  avatar: "",
  money: 100,
  myCollection: [],
  boosters: [],
  decks: [],
  darkMode: false,
};

describe("updateUser", () => {
  it("met à jour le pseudo avec succès", async () => {
    (updateById as jest.Mock).mockResolvedValue({
      ok: true,
      value: mockToObject(mockUpdatedUser),
    });

    const result = await updateUser("user-123", { pseudo: "NouveauPseudo" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.pseudo).toBe("NouveauPseudo");
    }
  });

  it("hashe le mot de passe si fourni", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedNewPassword");
    (updateById as jest.Mock).mockResolvedValue({
      ok: true,
      value: mockToObject(mockUpdatedUser),
    });

    await updateUser("user-123", { password: "newPassword123" });

    expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
  });

  it("retourne DATABASE_ERROR si la DB échoue", async () => {
    (updateById as jest.Mock).mockResolvedValue({ ok: false });

    const result = await updateUser("user-123", { pseudo: "Test" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
  });

  it("retourne USER_NOT_FOUND si l'utilisateur est null", async () => {
    (updateById as jest.Mock).mockResolvedValue({ ok: true, value: null });

    const result = await updateUser("user-123", { pseudo: "Test" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
  });

  it("retourne INVALID_USER si le parsing échoue", async () => {
    (updateById as jest.Mock).mockResolvedValue({
      ok: true,
      value: mockToObject({ id: "user-123" }),
    });

    const result = await updateUser("user-123", { pseudo: "Test" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("INVALID_USER");
  });
});
