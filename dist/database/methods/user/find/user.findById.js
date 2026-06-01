"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findById = void 0;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
const findById = async (id) => {
    try {
        const user = await user_model_1.UserModel.findById(id);
        return (0, Result_1.ok)(user);
    }
    catch (e) {
        return (0, Result_1.err)("Erreur lors de la recherche par ID");
    }
};
exports.findById = findById;
//# sourceMappingURL=user.findById.js.map