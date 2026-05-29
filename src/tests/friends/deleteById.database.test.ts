import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { deleteFriendById } from "@database/methods/friends/friend.deleteById";
import { UserModel } from "@database/models/user.model";

let mongoServer: MongoMemoryServer;

const createUser = (pseudo: string, email: string, friends: string[] = []) => ({
  pseudo,
  email,
  passwordHash: "hashed-password",
  avatar: "/avatars/avatar-1.webp",
  money: 100,
  countdownEnds: new Date(),
  myCollection: [],
  boosters: [],
  decks: [],
  darkMode: false,
  friends,
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe("deleteFriendById (friend.deleteById.ts)", () => {
  describe("succès", () => {
    it("devrait supprimer l'ami des deux côtés", async () => {
      const user = await UserModel.create(createUser("UserA", "a@example.com"));
      const friend = await UserModel.create(createUser("UserB", "b@example.com"));

      await UserModel.findByIdAndUpdate(user._id, { $push: { friends: friend._id } });
      await UserModel.findByIdAndUpdate(friend._id, { $push: { friends: user._id } });

      const result = await deleteFriendById(
        user._id.toString(),
        friend._id.toString()
      );

      expect(result.ok).toBe(true);

      const updatedUser = await UserModel.findById(user._id);
      const updatedFriend = await UserModel.findById(friend._id);

      expect(updatedUser?.friends).not.toContain(friend._id);
      expect(updatedFriend?.friends).not.toContain(user._id);
    });

    it("devrait retourner true même si l'ami n'était pas dans la liste", async () => {
      const user = await UserModel.create(createUser("UserA", "a@example.com"));
      const friend = await UserModel.create(createUser("UserB", "b@example.com"));

      const result = await deleteFriendById(
        user._id.toString(),
        friend._id.toString()
      );

      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(true);
    });
  });

  describe("erreurs", () => {
    it("devrait retourner DATABASE_ERROR si l'id est invalide", async () => {
      const result = await deleteFriendById("invalid-id", "friend-id");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });
  });
});