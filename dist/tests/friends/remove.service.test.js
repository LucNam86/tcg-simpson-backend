"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const friends_remove_1 = require("../../services/friends/friends.remove");
const userMethods = __importStar(require("../../database/methods/user"));
const friendsMethods = __importStar(require("../../database/methods/friends"));
const Result_1 = require("../../shared/Result");
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/methods/friends");
const mockFriend = {
    _id: { toString: () => "friend-id-123" },
    pseudo: "TestFriend",
    email: "friend@example.com",
};
(0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks();
});
(0, globals_1.describe)("removeUserFriendByPseudo", () => {
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait supprimer l'ami et retourner true", async () => {
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(mockFriend));
            globals_1.jest.mocked(friendsMethods.deleteFriendById).mockResolvedValue((0, Result_1.ok)(true));
            const result = await (0, friends_remove_1.removeUserFriendByPseudo)("user-id-123", "TestFriend");
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok)
                (0, globals_1.expect)(result.value).toBe(true);
        });
        (0, globals_1.it)("devrait appeler deleteFriendById avec les bons ids", async () => {
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(mockFriend));
            globals_1.jest.mocked(friendsMethods.deleteFriendById).mockResolvedValue((0, Result_1.ok)(true));
            await (0, friends_remove_1.removeUserFriendByPseudo)("user-id-123", "TestFriend");
            (0, globals_1.expect)(friendsMethods.deleteFriendById).toHaveBeenCalledWith("user-id-123", "friend-id-123");
        });
    });
    (0, globals_1.describe)("erreurs", () => {
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si le pseudo n'existe pas", async () => {
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, friends_remove_1.removeUserFriendByPseudo)("user-id-123", "UnknownFriend");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si findByPseudo échoue", async () => {
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, friends_remove_1.removeUserFriendByPseudo)("user-id-123", "TestFriend");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si deleteFriendById échoue", async () => {
            globals_1.jest.mocked(userMethods.findByPseudo).mockResolvedValue((0, Result_1.ok)(mockFriend));
            globals_1.jest.mocked(friendsMethods.deleteFriendById).mockResolvedValue((0, Result_1.err)("DATABASE_ERROR"));
            const result = await (0, friends_remove_1.removeUserFriendByPseudo)("user-id-123", "TestFriend");
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok)
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
        });
    });
});
//# sourceMappingURL=remove.service.test.js.map