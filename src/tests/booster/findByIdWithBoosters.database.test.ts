import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { findByIdWithBoosters } from "@database/methods/user";
import { UserModel } from "@database/models/user.model";
import "@database/models/family.model";
import "@database/models/affinity.model";
import "@database/models/serie.model";
import "@database/models/card.model";
import "@database/models/booster.model";

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
  await mongoose.connect(mongoServer.getUri() + "findByIdWithBoosters");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe("findByIdWithBoosters (user.findByIdWithBoosters.ts)", () => {
  describe("succès", () => {

 it("devrait retourner l'utilisateur avec ses boosters", async () => {
  const created = await UserModel.create(validUser);
  console.log("Created user id:", created._id.toString());
  
  const result = await findByIdWithBoosters(created._id.toString());
  console.log("Result ok:", result.ok);
  console.log("Result error:", !result.ok ? (result as any).error : "none");

  expect(result.ok).toBe(true);
});
  });

  describe("erreurs", () => {
    it("devrait retourner une erreur si l'id est invalide", async () => {
      const result = await findByIdWithBoosters("invalid-id");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Erreur lors de la recherche avec boosters");
      }
    });
  });
});