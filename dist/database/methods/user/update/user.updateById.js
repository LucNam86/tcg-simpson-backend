"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateById = void 0;
// database/methods/user.methods.ts
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
const updateById = async (id, updateData) => {
    try {
        const user = await user_model_1.UserModel.findByIdAndUpdate(id, updateData, {
            returnDocument: "after",
        });
        return (0, Result_1.ok)(user);
    }
    catch (e) {
        console.error("updateUserById error:", JSON.stringify(e, null, 2));
        if (e.code === 11000) {
            return (0, Result_1.err)("PSEUDO_ALREADY_USED");
        }
        return (0, Result_1.err)("Erreur lors de la mise à jour de l'utilisateur");
    }
};
exports.updateById = updateById;
//# sourceMappingURL=user.updateById.js.map