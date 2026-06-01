"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserFriend = addUserFriend;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const friends_1 = require("../../database/methods/friends");
async function addUserFriend(userId, friendPseudo) {
    const friendResult = await (0, user_1.findByPseudo)(friendPseudo);
    if (!friendResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!friendResult.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    const friendId = friendResult.value._id.toString();
    if (friendId === userId)
        return (0, Result_1.err)("CANT_ADD_SELF");
    const addResult = await (0, friends_1.saveFriend)(userId, friendId);
    if (!addResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    return (0, Result_1.ok)(true);
}
//# sourceMappingURL=friends.add.js.map