"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByManyPseudo = findByManyPseudo;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
async function findByManyPseudo(query, excludeUserId) {
    try {
        const users = await user_model_1.UserModel.find({
            _id: { $ne: excludeUserId },
            pseudo: { $regex: `^${query}`, $options: "i" }
        })
            .select("pseudo avatar")
            .limit(5);
        return (0, Result_1.ok)(users);
    }
    catch (e) {
        return (0, Result_1.err)("Erreur lors de la recherche des pseudos");
    }
}
//# sourceMappingURL=user.findbyManyPseudo.js.map