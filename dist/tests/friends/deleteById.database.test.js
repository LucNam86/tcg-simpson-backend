"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const friend_deleteById_1 = require("../../database/methods/friends/friend.deleteById");
const user_model_1 = require("../../database/models/user.model");
let mongoServer;
const createUser = (pseudo, email, friends = []) => ({
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
(0, globals_1.beforeAll)(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri() + "deleteFriend");
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.beforeEach)(async () => {
    await user_model_1.UserModel.deleteMany({});
});
(0, globals_1.describe)("deleteFriendById (friend.deleteById.ts)", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait supprimer l'ami des deux côtés", async () => {
            const user = await user_model_1.UserModel.create(createUser("UserA", "a@example.com"));
            const friend = await user_model_1.UserModel.create(createUser("UserB", "b@example.com"));
            await user_model_1.UserModel.findByIdAndUpdate(user._id, { $push: { friends: friend._id } });
            await user_model_1.UserModel.findByIdAndUpdate(friend._id, { $push: { friends: user._id } });
            const result = await (0, friend_deleteById_1.deleteFriendById)(user._id.toString(), friend._id.toString());
            (0, globals_1.expect)(result.ok).toBe(true);
            const updatedUser = await user_model_1.UserModel.findById(user._id);
            const updatedFriend = await user_model_1.UserModel.findById(friend._id);
            (0, globals_1.expect)(updatedUser?.friends).not.toContain(friend._id);
            (0, globals_1.expect)(updatedFriend?.friends).not.toContain(user._id);
        });
        (0, globals_1.it)("devrait retourner true même si l'ami n'était pas dans la liste", async () => {
            const user = await user_model_1.UserModel.create(createUser("UserA", "a@example.com"));
            const friend = await user_model_1.UserModel.create(createUser("UserB", "b@example.com"));
            const result = await (0, friend_deleteById_1.deleteFriendById)(user._id.toString(), friend._id.toString());
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok)
                (0, globals_1.expect)(result.value).toBe(true);
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si l'id est invalide", async () => {
            const result = await (0, friend_deleteById_1.deleteFriendById)("invalid-id", "friend-id");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=deleteById.database.test.js.map