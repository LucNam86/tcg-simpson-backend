import { fetchUserById, fetchUserCollection } from "@services/user/user.fetch";
import { findById, findByIdWithPopulate } from "@database/methods/user";

jest.mock("@database/methods/user");

const mockToObject = (data: object) => ({
  toObject: jest.fn().mockReturnValue(data),
});

const mockCard = {
  id: "card-1",
  name: "Marge futuriste",
  slug: "marge-futuriste",
  ATK: 25,
  PV: 80,
  description: "Une carte de test",
  rarity: "3",
  type: "Personnage",
  serie: {
    id_serie: { id: "serie-1", name: "Série 1" },
    position: 2,
  },
  family: {
    id: "family-1",
    name: "Simpson",
    desc: "La famille Simpson",
    bonus: { ATK: 0, PV: 10 },
  },
  affinity: {
    id: "affinity-1",
    name: "Homer et Marge",
    desc: "Un couple iconic",
    bonus: { ATK: 0, PV: 30 },
  },
};

const mockUser = {
  id: "user-123",
  pseudo: "LucYop",
  email: "luc@test.com",
  avatar: "",
  money: 100,
  myCollection: [],
  boosters: [],
  decks: [],
  darkMode: false,
};

describe("fetchUserById", () => {
  it("retourne un utilisateur valide", async () => {
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

  it("retourne INVALID_USER si le parsing échoue", async () => {
    (findById as jest.Mock).mockResolvedValue({
      ok: true,
      value: mockToObject({ id: "user-123" }),
    });

    const result = await fetchUserById("user-123");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("INVALID_USER");
  });
});

describe("fetchUserCollection", () => {
  it("retourne la collection de l'utilisateur", async () => {
    (findByIdWithPopulate as jest.Mock).mockResolvedValue({
      ok: true,
      value: mockToObject({ myCollection: [mockCard] }),
    });

    const result = await fetchUserCollection("user-123");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0].name).toBe("Marge futuriste");
    }
  });

  it("retourne une collection vide", async () => {
    (findByIdWithPopulate as jest.Mock).mockResolvedValue({
      ok: true,
      value: mockToObject({ myCollection: [] }),
    });

    const result = await fetchUserCollection("user-123");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toHaveLength(0);
  });

  it("retourne DATABASE_ERROR si la DB échoue", async () => {
    (findByIdWithPopulate as jest.Mock).mockResolvedValue({ ok: false });

    const result = await fetchUserCollection("user-123");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
  });

  it("retourne USER_NOT_FOUND si l'utilisateur est null", async () => {
    (findByIdWithPopulate as jest.Mock).mockResolvedValue({
      ok: true,
      value: null,
    });

    const result = await fetchUserCollection("user-123");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
  });
});
