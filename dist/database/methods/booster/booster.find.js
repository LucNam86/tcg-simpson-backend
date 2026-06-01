"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = void 0;
const Result_1 = require("../../../shared/Result");
const booster_model_1 = require("../../models/booster.model");
const find = async () => {
    try {
        const boosters = await booster_model_1.BoosterModel.find()
            .populate({
            path: "cards",
            populate: [
                { path: "family" },
                { path: "affinity" },
                { path: "serie.id_serie" },
            ],
        })
            .populate("serie");
        return (0, Result_1.ok)(boosters);
    }
    catch (e) {
        console.error("find error:", e);
        return (0, Result_1.err)("Erreur lors de la recherche de tous les boosters");
    }
};
exports.find = find;
//# sourceMappingURL=booster.find.js.map