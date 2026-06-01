"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findById = void 0;
const Result_1 = require("../../../shared/Result");
const booster_model_1 = require("../../models/booster.model");
const findById = async (id) => {
    try {
        const booster = await booster_model_1.BoosterModel.findById(id);
        return (0, Result_1.ok)(booster);
    }
    catch (e) {
        return (0, Result_1.err)("Erreur lors de la recherche par ID");
    }
};
exports.findById = findById;
//# sourceMappingURL=booster.findById.js.map