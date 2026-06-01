"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserFriends = fetchUserFriends;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const mapper_1 = require("../../database/mapper");
async function fetchUserFriends(id) {
    const result = await (0, user_1.findByIdWithFriends)(id);
    if (!result.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!result.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    return (0, Result_1.ok)(result.value.map(mapper_1.mapFriend));
}
//# sourceMappingURL=friends.fetch.js.map