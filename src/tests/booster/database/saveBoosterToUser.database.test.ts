import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { saveBoosterToUser } from "@database/methods/booster/booster.save";
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
  await mongoose.connect(mongoServer.getUri() + "saveBoosterToUser");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe("saveBoosterToUser (booster.save.ts)", () => {
  describe("succès", () => {
    it("devrait ajouter un nouveau booster à l'utilisateur", async () => {
      const created = await UserModel.create(validUser);
      const boosterId = new mongoose.Types.ObjectId().toString();

      const result = await saveBoosterToUser(created._id.toString(), boosterId);

      expect(result.ok).toBe(true);

      const updated = await UserModel.findById(created._id);
      expect(updated?.boosters).toHaveLength(1);
      expect(updated?.boosters[0].number).toBe(1);
    });

    it("devrait incrémenter le nombre si le booster existe déjà", async () => {
      const boosterId = new mongoose.Types.ObjectId();
      const created = await UserModel.create({
        ...validUser,
        boosters: [{ booster: boosterId, number: 1 }],
      });

      const result = await saveBoosterToUser(
        created._id.toString(),
        boosterId.toString()
      );

      expect(result.ok).toBe(true);

      const updated = await UserModel.findById(created._id);
      expect(updated?.boosters).toHaveLength(1);
      expect(updated?.boosters[0].number).toBe(2);
    });
  });

  describe("erreurs", () => {
    it("devrait retourner USER_NOT_FOUND si l'utilisateur n'existe pas", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const boosterId = new mongoose.Types.ObjectId().toString();

      const result = await saveBoosterToUser(fakeId, boosterId);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner DATABASE_ERROR si l'id est invalide", async () => {
      const result = await saveBoosterToUser("invalid-id", "booster-id");

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });
  });
});