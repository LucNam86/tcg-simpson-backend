"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserById = fetchUserById;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const mapper_1 = require("../../database/mapper");
async function fetchUserById(id) {
    const result = await (0, user_1.findByIdWithCollection)(id);
    if (!result.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!result.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    return (0, Result_1.ok)((0, mapper_1.mapUser)(result.value));
}
//# sourceMappingURL=profile.fetchById.js.map