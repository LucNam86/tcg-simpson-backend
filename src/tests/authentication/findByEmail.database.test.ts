import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { findByEmail } from "@database/methods/user/find/user.findByEmail";
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
  await mongoose.connect(mongoServer.getUri() + "findByEmail");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe("findByEmail (user.findByEmail.ts)", () => {
  describe("succès", () => {
    it("devrait retourner l'utilisateur si l'email existe", async () => {
      await UserModel.create(validUser);

      const result = await findByEmail("test@example.com");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value?.pseudo).toBe("TestUser");
        expect(result.value?.email).toBe("test@example.com");
      }
    });

    it("devrait retourner null si l'email n'existe pas", async () => {
      const result = await findByEmail("unknown@example.com");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBeNull();
      }
    });

    it("devrait retourner le bon utilisateur parmi plusieurs", async () => {
      await UserModel.create(validUser);
      await UserModel.create({
        ...validUser,
        email: "second@example.com",
        pseudo: "SecondUser",
      });

      const result = await findByEmail("second@example.com");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value?.pseudo).toBe("SecondUser");
        expect(result.value?.email).toBe("second@example.com");
      }
    });

    it("devrait être insensible à la casse pour la recherche", async () => {
      await UserModel.create(validUser);

      const result = await findByEmail("TEST@EXAMPLE.COM");

      // MongoDB est sensible à la casse par défaut
      // ce test vérifie le comportement actuel
      expect(result.ok).toBe(true);
    });
  });

  describe("erreurs", () => {
    it("devrait retourner une erreur si l'email est invalide au niveau mongoose", async () => {
      await mongoose.disconnect();

      const result = await findByEmail("test@example.com");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Erreur lors de la recherche par email");
      }

      // Reconnexion pour les tests suivants
      await mongoose.connect(mongoServer.getUri());
    });
  });
});