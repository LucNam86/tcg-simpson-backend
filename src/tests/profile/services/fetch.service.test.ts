import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { fetchUserById } from "@services/profile/profile.fetchById";
import * as userMethods from "@database/methods/user";
import * as userMapper from "@database/mapper";
import { ok, err } from "@shared/Result";

jest.mock("@database/methods/user");
jest.mock("@database/mapper");

const mockPopulatedUser = {
  _id: "user-id-123",
  pseudo: "TestUser",
  email: "test@example.com",
  avatar: "/avatars/avatar-1.webp",
  money: 100,
  darkMode: false,
  countdownEnds: new Date(),
  myCollection: [],
  boosters: [],
  decks: [],
  friends: [],
};

const mockMappedUser = {
  id: "user-id-123",
  pseudo: "TestUser",
  email: "test@example.com",
  avatar: "/avatars/avatar-1.webp",
  money: 100,
  darkMode: false,
  countdownEnds: new Date(),
  myCollection: [],
  boosters: [],
  decks: [],
  friends: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(userMapper.mapUser).mockReturnValue(mockMappedUser);
});

describe("fetchUserById", () => {
  describe("succès", () => {
    it("devrait retourner le profil mappé", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        ok(mockPopulatedUser as any)
      );

      const result = await fetchUserById("user-id-123");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(mockMappedUser);
      }
    });

    it("devrait appeler mapUser avec le document populé", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        ok(mockPopulatedUser as any)
      );

      await fetchUserById("user-id-123");

      expect(userMapper.mapUser).toHaveBeenCalledWith(mockPopulatedUser);
    });
  });

  describe("erreurs", () => {
    it("devrait retourner USER_NOT_FOUND si le document est null", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        ok(null as any)
      );

      const result = await fetchUserById("user-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner DATABASE_ERROR si la requête BDD échoue", async () => {
      jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue(
        err("DB_ERROR")
      );

      const result = await fetchUserById("user-id-123");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });
  });
});