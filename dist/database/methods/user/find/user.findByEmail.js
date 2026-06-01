"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = void 0;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
const findByEmail = async (email) => {
    try {
        const user = await user_model_1.UserModel.findOne({ email });
        return (0, Result_1.ok)(user);
    }
    catch (e) {
        return (0, Result_1.err)("Erreur lors de la recherche par email");
    }
};
exports.findByEmail = findByEmail;
//# sourceMappingURL=user.findByEmail.js.map