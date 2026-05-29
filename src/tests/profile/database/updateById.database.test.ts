import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { updateById } from "@database/methods/user/update/user.updateById";
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
  await mongoose.connect(mongoServer.getUri() + "updateUser");
});


afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe("updateById (user.updateById.ts)", () => {
  describe("succès", () => {
    it("devrait mettre à jour le pseudo et retourner le document mis à jour", async () => {
      const created = await UserModel.create(validUser);

      const result = await updateById(created._id.toString(), { pseudo: "UpdatedUser" });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value?.pseudo).toBe("UpdatedUser");
      }
    });

    it("devrait mettre à jour l'avatar", async () => {
      const created = await UserModel.create(validUser);

      const result = await updateById(created._id.toString(), {
        avatar: "/avatars/avatar-5.webp",
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value?.avatar).toBe("/avatars/avatar-5.webp");
      }
    });

    it("devrait mettre à jour la money", async () => {
      const created = await UserModel.create(validUser);

      const result = await updateById(created._id.toString(), { money: 500 });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value?.money).toBe(500);
      }
    });

    it("devrait retourner null si l'id n'existe pas", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const result = await updateById(fakeId, { pseudo: "UpdatedUser" });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBeNull();
      }
    });

    it("devrait persister les modifications en BDD", async () => {
      const created = await UserModel.create(validUser);

      await updateById(created._id.toString(), { pseudo: "UpdatedUser" });

      const found = await UserModel.findById(created._id);
      expect(found?.pseudo).toBe("UpdatedUser");
    });

    it("devrait retourner le document APRÈS modification (returnDocument after)", async () => {
      const created = await UserModel.create(validUser);

      const result = await updateById(created._id.toString(), { money: 999 });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value?.money).toBe(999);
      }
    });
  });

  describe("erreurs", () => {
    it("devrait retourner PSEUDO_ALREADY_USED en cas de doublon", async () => {
      await UserModel.create(validUser);
      const second = await UserModel.create({
        ...validUser,
        email: "second@example.com",
        pseudo: "SecondUser",
      });

      const result = await updateById(second._id.toString(), {
        pseudo: "TestUser", // pseudo déjà pris
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("PSEUDO_ALREADY_USED");
      }
    });
  });
});