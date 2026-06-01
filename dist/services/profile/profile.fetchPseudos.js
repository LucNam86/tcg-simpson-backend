"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPseudosAutocomplete = fetchPseudosAutocomplete;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
async function fetchPseudosAutocomplete(query, excludeUserId) {
    const result = await (0, user_1.findByManyPseudo)(query, excludeUserId);
    if (!result.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    return (0, Result_1.ok)(result.value);
}
//# sourceMappingURL=profile.fetchPseudos.js.map