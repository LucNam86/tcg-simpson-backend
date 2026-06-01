"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByIdWithCollection = findByIdWithCollection;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
async function findByIdWithCollection(id) {
    try {
        const user = await user_model_1.UserModel.findById(id)
            .populate({
            path: "myCollection",
            populate: [
                { path: "family" },
                { path: "affinity" },
                { path: "serie.id_serie" },
            ],
        })
            .lean();
        if (!user)
            return (0, Result_1.err)("User not found");
        return (0, Result_1.ok)(user);
    }
    catch (e) {
        return (0, Result_1.err)("Erreur lors de la recherche avec collection");
    }
}
//# sourceMappingURL=user.findByIdWithCollection.js.map