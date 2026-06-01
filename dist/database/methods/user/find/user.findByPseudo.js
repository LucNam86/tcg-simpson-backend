"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByPseudo = findByPseudo;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
async function findByPseudo(pseudo) {
    try {
        const user = await user_model_1.UserModel.findOne({ pseudo });
        return (0, Result_1.ok)(user);
    }
    catch (e) {
        return (0, Result_1.err)("Erreur lors de la recherche par pseudo");
    }
}
//# sourceMappingURL=user.findByPseudo.js.map