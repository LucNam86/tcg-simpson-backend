import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { saveDeck } from "@database/methods/deck/deck.save"
import { DeckModel } from "@database/models/deck.model";
import { UserModel } from "@database/models/user.model";

let mongoServer: MongoMemoryServer;

const mockUserId = new mongoose.Types.ObjectId();
const mockCardId1 = new mongoose.Types.ObjectId().toString();
const mockCardId2 = new mongoose.Types.ObjectId().toString();

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await DeckModel.deleteMany({});
  await UserModel.deleteMany({});
  jest.restoreAllMocks();
});

describe("saveDeck (Integration)", () => {
  describe("succès", () => {
   it("devrait créer un deck en BDD et pousser son ID dans le modèle de l'utilisateur", async () => {
  await UserModel.create({
    _id: mockUserId,
    pseudo: "Yugi",
    email: "yugi@test.com",
    passwordHash: "hashed-password",
    avatar: "/avatars/avatar-1.webp",
    money: 100,
    countdownEnds: new Date(),
    myCollection: [],
    boosters: [],
    decks: [],
    darkMode: false,
  });

  const input = {  // 👈 doit être défini ici
    userId: mockUserId.toString(),
    name: "Mon Deck Magique",
    cards: [mockCardId1, mockCardId2],
    isActive: true,
  };

  const result = await saveDeck(input);

  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.value.name).toBe("Mon Deck Magique");
    expect(result.value.isActive).toBe(true);
    expect(result.value.user.toString()).toBe(mockUserId.toString());
    expect(result.value.cards[0].toString()).toBe(mockCardId1);
  }

  const createdDeck = await DeckModel.findOne({ name: "Mon Deck Magique" });
  expect(createdDeck).not.toBeNull();

  const updatedUser = await UserModel.findById(mockUserId);
  expect(updatedUser?.decks).toContainEqual(createdDeck?._id);
});
  });

  describe("erreurs", () => {
    it("devrait retourner DATABASE_ERROR et intercepter l'erreur si la sauvegarde échoue", async () => {
      // On force la méthode .save() du prototype de DeckModel à planter
      jest.spyOn(DeckModel.prototype, "save").mockImplementationOnce(() => {
        throw new Error("Simulated validation error or connection drop");
      });

      // On cache le console.error pour garder des logs propres
      jest.spyOn(console, "error").mockImplementation(() => {});

      const input = {
        userId: mockUserId.toString(),
        name: "Deck Crash",
        cards: [],
        isActive: false,
      };

      const result = await saveDeck(input);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("DATABASE_ERROR");
      }
      expect(console.error).toHaveBeenCalled();
    });
  });
});