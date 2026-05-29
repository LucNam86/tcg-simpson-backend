import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { save } from "@database/methods/user/save/user.save";
import { UserModel } from "@database/models/user.model";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri() + "saveUser");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

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

describe("save (user.save.ts)", () => {
  describe("succès", () => {
    it("devrait créer un utilisateur et retourner son id", async () => {
      const result = await save(validUser);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(typeof result.value).toBe("string");
        expect(result.value).toHaveLength(24); // ObjectId MongoDB
      }
    });

    it("devrait persister l'utilisateur en BDD", async () => {
      const result = await save(validUser);

      if (result.ok) {
        const found = await UserModel.findById(result.value);
        expect(found).not.toBeNull();
        expect(found?.pseudo).toBe("TestUser");
        expect(found?.email).toBe("test@example.com");
        expect(found?.money).toBe(100);
      }
    });

    it("devrait retourner un id différent pour chaque utilisateur", async () => {
      const result1 = await save({ ...validUser, email: "user1@example.com", pseudo: "User1" });
      const result2 = await save({ ...validUser, email: "user2@example.com", pseudo: "User2" });

      expect(result1.ok).toBe(true);
      expect(result2.ok).toBe(true);
      if (result1.ok && result2.ok) {
        expect(result1.value).not.toBe(result2.value);
      }
    });
  });

  describe("erreurs", () => {
    it("devrait retourner une erreur si un champ requis est manquant", async () => {
      const result = await save({ email: "test@example.com" }); // pseudo manquant

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Erreur lors de la sauvegarde");
      }
    });

    it("devrait retourner une erreur si l'email est dupliqué", async () => {
      await save(validUser);
      const result = await save(validUser); // même email

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Erreur lors de la sauvegarde");
      }
    });
  });
});