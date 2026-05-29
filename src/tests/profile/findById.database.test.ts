import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { findById } from "@database/methods/user/find/user.findById";
import { UserModel } from "@database/models/user.model";

let mongoServer: MongoMemoryServer;

const validUser = {
  pseudo: "TestUser",
  email: "test@example.com",
  passwordHash: "hashed-password",
  avatar: "/avatars/avatar-1.webp",
  money: 100,
  countdownEnds: new Date(),
  myCollection: [],
  boosters: [],
  decks: [],
  darkMode: false,
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri() + "findById");
});


afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe("findById (user.findById.ts)", () => {
  describe("succès", () => {
    it("devrait retourner l'utilisateur si l'id existe", async () => {
      const created = await UserModel.create(validUser);

      const result = await findById(created._id.toString());

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value?.pseudo).toBe("TestUser");
        expect(result.value?.email).toBe("test@example.com");
        expect(result.value?.money).toBe(100);
      }
    });

    it("devrait retourner null si l'id n'existe pas", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const result = await findById(fakeId);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBeNull();
      }
    });

    it("devrait retourner le bon utilisateur parmi plusieurs", async () => {
      await UserModel.create(validUser);
      const second = await UserModel.create({
        ...validUser,
        email: "second@example.com",
        pseudo: "SecondUser",
      });

      const result = await findById(second._id.toString());

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value?.pseudo).toBe("SecondUser");
        expect(result.value?.email).toBe("second@example.com");
      }
    });
  });

  describe("erreurs", () => {
    it("devrait retourner une erreur si l'id est invalide", async () => {
      const result = await findById("invalid-id");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Erreur lors de la recherche par ID");
      }
    });
  });
});