"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByIdWithBoosters = findByIdWithBoosters;
const user_model_1 = require("../../../models/user.model");
const Result_1 = require("../../../../shared/Result");
async function findByIdWithBoosters(id) {
    try {
        const user = await user_model_1.UserModel.findById(id)
            .populate({
            path: "boosters.booster",
            populate: [
                {
                    path: "cards",
                    populate: [
                        { path: "family" },
                        { path: "affinity" },
                        { path: "serie.id_serie" },
                    ],
                },
                { path: "serie" },
            ],
        })
            .lean();
        if (!user)
            return (0, Result_1.err)("User not found");
        return (0, Result_1.ok)(user);
    }
    catch (e) {
        return (0, Result_1.err)("Erreur lors de la recherche avec boosters");
    }
}
//# sourceMappingURL=user.findByIdWithBooster.js.map