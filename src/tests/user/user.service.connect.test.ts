import { connectUser } from "@services/user/user.connect";
import { findByEmail } from "@database/methods/user";
import bcrypt from "bcrypt";

jest.mock("@database/methods/user");
jest.mock("bcrypt");

describe("connectUser", () => {
  const mockUser = {
    id: "user-123",
    pseudo: "LucYop",
    email: "luc@test.com",
    passwordHash: "hashedPassword",
    avatar: "",
    money: 100,
    myCollection: [],
    boosters: [],
    deck: [],
    darkMode: false,
  };

  it("connecte un utilisateur avec des credentials valides", async () => {
    (findByEmail as jest.Mock).mockResolvedValue({ ok: true, value: mockUser });
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

    const result = await connectUser({ email: "luc@test.com", password: "password123" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.pseudo).toBe("LucYop");
      expect(result.value.email).toBe("luc@test.com");
    }
  });

  it("retourne CREDENTIALS_UNKNOWN si l'email n'existe pas", async () => {
    (findByEmail as jest.Mock).mockResolvedValue({ ok: false });

    const result = await connectUser({ email: "inconnu@test.com", password: "password123" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("CREDENTIALS_UNKNOWN");
  });

  it("retourne CREDENTIALS_UNKNOWN si l'utilisateur est null", async () => {
    (findByEmail as jest.Mock).mockResolvedValue({ ok: true, value: null });

    const result = await connectUser({ email: "luc@test.com", password: "password123" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("CREDENTIALS_UNKNOWN");
  });

  it("retourne WRONG_CREDENTIALS si le mot de passe est incorrect", async () => {
    (findByEmail as jest.Mock).mockResolvedValue({ ok: true, value: mockUser });
    (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

    const result = await connectUser({ email: "luc@test.com", password: "wrongPassword" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("WRONG_CREDENTIALS");
  });
});
