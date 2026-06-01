"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllCards = void 0;
const Result_1 = require("../../../shared/Result");
const card_model_1 = require("../../models/card.model");
const findAllCards = async () => {
    try {
        const cards = await card_model_1.CardModel.find()
            .populate("family")
            .populate("affinity")
            .populate("serie.id_serie");
        return (0, Result_1.ok)(cards);
    }
    catch (e) {
        console.error("find error:", e);
        return (0, Result_1.err)("Erreur lors de la recherche de toutes les cartes");
    }
};
exports.findAllCards = findAllCards;
//# sourceMappingURL=card.find.js.map