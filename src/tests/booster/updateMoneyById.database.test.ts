import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { updateMoneyById } from "@database/methods/user/update/user.updateMoneyById";
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
  await mongoose.connect(mongoServer.getUri() + "updateMoneyById");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe("updateMoneyById (user.updateMoneyById.ts)", () => {
  describe("succès", () => {
    it("devrait mettre à jour la money et retourner le nouveau solde", async () => {
      const created = await UserModel.create(validUser);

      const result = await updateMoneyById(created._id.toString(), 200);

      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(200);
    });

    it("devrait persister la mise à jour en BDD", async () => {
      const created = await UserModel.create(validUser);

      await updateMoneyById(created._id.toString(), 500);

      const updated = await UserModel.findById(created._id);
      expect(updated?.money).toBe(500);
    });

    it("devrait accepter une valeur de 0", async () => {
      const created = await UserModel.create(validUser);

      const result = await updateMoneyById(created._id.toString(), 0);

      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(0);
    });
  });

  describe("erreurs", () => {
    it("devrait retourner USER_NOT_FOUND si l'utilisateur n'existe pas", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const result = await updateMoneyById(fakeId, 100);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("USER_NOT_FOUND");
    });

    it("devrait retourner DATABASE_ERROR si l'id est invalide", async () => {
      const result = await updateMoneyById("invalid-id", 100);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe("DATABASE_ERROR");
    });
  });
});