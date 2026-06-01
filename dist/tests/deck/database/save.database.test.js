"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const deck_save_1 = require("../../../database/methods/deck/deck.save");
const deck_model_1 = require("../../../database/models/deck.model");
const user_model_1 = require("../../../database/models/user.model");
let mongoServer;
const mockUserId = new mongoose_1.default.Types.ObjectId();
const mockCardId1 = new mongoose_1.default.Types.ObjectId().toString();
const mockCardId2 = new mongoose_1.default.Types.ObjectId().toString();
(0, globals_1.beforeAll)(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri());
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.beforeEach)(async () => {
    await deck_model_1.DeckModel.deleteMany({});
    await user_model_1.UserModel.deleteMany({});
    globals_1.jest.restoreAllMocks();
});
(0, globals_1.describe)("saveDeck (Integration)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait créer un deck en BDD et pousser son ID dans le modèle de l'utilisateur", async () => {
            await user_model_1.UserModel.create({
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
            const input = {
                userId: mockUserId.toString(),
                name: "Mon Deck Magique",
                cards: [mockCardId1, mockCardId2],
                isActive: true,
            };
            const result = await (0, deck_save_1.saveDeck)(input);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value.name).toBe("Mon Deck Magique");
                (0, globals_1.expect)(result.value.isActive).toBe(true);
                (0, globals_1.expect)(result.value.user.toString()).toBe(mockUserId.toString());
                (0, globals_1.expect)(result.value.cards[0].toString()).toBe(mockCardId1);
            }
            const createdDeck = await deck_model_1.DeckModel.findOne({ name: "Mon Deck Magique" });
            (0, globals_1.expect)(createdDeck).not.toBeNull();
            const updatedUser = await user_model_1.UserModel.findById(mockUserId);
            (0, globals_1.expect)(updatedUser?.decks).toContainEqual(createdDeck?._id);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner DATABASE_ERROR et intercepter l'erreur si la sauvegarde échoue", async () => {
            // On force la méthode .save() du prototype de DeckModel à planter
            globals_1.jest.spyOn(deck_model_1.DeckModel.prototype, "save").mockImplementationOnce(() => {
                throw new Error("Simulated validation error or connection drop");
            });
            // On cache le console.error pour garder des logs propres
            globals_1.jest.spyOn(console, "error").mockImplementation(() => { });
            const input = {
                userId: mockUserId.toString(),
                name: "Deck Crash",
                cards: [],
                isActive: false,
            };
            const result = await (0, deck_save_1.saveDeck)(input);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=save.database.test.js.map