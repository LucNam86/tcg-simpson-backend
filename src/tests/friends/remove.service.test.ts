import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { removeUserFriendByPseudo } from "@services/friends/friends.remove";
import * as userMethods from "@database/methods/user";
import * as friendsMethods from "@database/methods/friends";
import { ok, err } from "@shared/Result";

jest.mock("@database/methods/user");
jest.mock("@database/methods/friends");

const mockFriend = {
  _id: { toString: () => "friend-id-123" },
  pseudo: "TestFriend",
  email: "friend@example.com",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("removeUserFriendByPseudo", () => {
  describe("succès", () => {
    it("devrait supprimer l'ami et retourner true", async () => {
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(mockFriend as any));
      jest.mocked(friendsMethods.deleteFriendById).mockResolvedValue(ok(true));

      const result = await removeUserFriendByPseudo("user-id-123", "TestFriend");

      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(true);
    });

    it("devrait appeler deleteFriendById avec les bons ids", async () => {
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(mockFriend as any));
      jest.mocked(friendsMethods.deleteFriendById).mockResolvedValue(ok(true));

      await removeUserFriendByPseudo("user-id-123", "TestFriend");

      expect(friendsMethods.deleteFriendById).toHaveBeenCalledWith(
        "user-id-123",
        "friend-id-123"
      );
    });
  });

  describe("erreurs", () => {
    it("devrait retourner USER_NOT_FOUND si le pseudo n'existe pas", async () => {
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(null as any));

      const result = await removeUserFriendByPseudo("user-id-123", "UnknownFriend");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner DATABASE_ERROR si findByPseudo échoue", async () => {
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(err("DB_ERROR"));

      const result = await removeUserFriendByPseudo("user-id-123", "TestFriend");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });

    it("devrait retourner DATABASE_ERROR si deleteFriendById échoue", async () => {
      jest.mocked(userMethods.findByPseudo).mockResolvedValue(ok(mockFriend as any));
      jest.mocked(friendsMethods.deleteFriendById).mockResolvedValue(err("DATABASE_ERROR"));

      const result = await removeUserFriendByPseudo("user-id-123", "TestFriend");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });
  });
});