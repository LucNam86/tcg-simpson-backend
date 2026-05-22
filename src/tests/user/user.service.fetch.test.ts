import { fetchUserById, fetchUserCollection } from "./user.fetch";
import { findById, findByIdWithCollectionsAndDeck } from "@database/methods/user";

jest.mock("@database/methods/user");

const mockToObject = (data: object) => ({
  toObject: jest.fn().mockReturnValue(data),
});

describe("fetchUserById", () => {
  it("retourne un utilisateur valide", async () => {
    const mockUser = {
      id: "user-123",
      pseudo: "LucYop",
      email: "luc@test.com",
      avatar: null,
      money: 100,
      myCollection: [],
      boosters: [],
      deck: [],
      darkMode: false,
    };

    (findById as jest.Mock).mockResolvedValue({
      ok: true,
      value: mockToObject(mockUser),
    });

    const result = await fetchUserById("user-123");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.pseudo).toBe("LucYop");
    }
  });

  it("retourne DATABASE_ERROR si la DB échoue", async () => {
    (findById as jest.Mock).mockResolvedValue({ ok: false });

    const result = await fetchUserById("user-123");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
  });

  it("retourne USER_NOT_FOUND si l'utilisateur est null", async () => {
    (findById as jest.Mock).mockResolvedValue({ ok: true, value: null });

    const result = await fetchUserById("user-123");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
  });
});

describe("fetchUserCollection", () => {
  it("retourne la collection de l'utilisateur", async () => {
    const mockCollection = [
      { id: "card-1", name: "Marge futuriste", slug: "marge-futuriste" },
    ];

    (findByIdWithCollectionsAndDeck as jest.Mock).mockResolvedValue({
      ok: true,
      value: mockToObject({ myCollection: mockCollection }),
    });

    const result = await fetchUserCollection("user-123");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(1);
    }
  });

  it("retourne DATABASE_ERROR si la DB échoue", async () => {
    (findByIdWithCollectionsAndDeck as jest.Mock).mockResolvedValue({ ok: false });

    const result = await fetchUserCollection("user-123");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
  });

  it("retourne USER_NOT_FOUND si l'utilisateur est null", async () => {
    (findByIdWithCollectionsAndDeck as jest.Mock).mockResolvedValue({
      ok: true,
      value: null,
    });

    const result = await fetchUserCollection("user-123");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
  });
});
