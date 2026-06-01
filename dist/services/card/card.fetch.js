"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCards = fetchCards;
const Result_1 = require("../../shared/Result");
const card_find_1 = require("../../database/methods/card/card.find");
const card_mapper_1 = require("../../database/mapper/card.mapper");
async function fetchCards(filters) {
    const result = await (0, card_find_1.findAllCards)();
    if (!result.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!result.value)
        return (0, Result_1.err)("NO_CARDS");
    let collection = result.value || [];
    if (filters.q && filters.q.trim() !== "") {
        const searchLower = filters.q.toLowerCase().trim();
        collection = collection.filter((card) => {
            const matchName = card.name?.toLowerCase().includes(searchLower);
            const matchDesc = card.description?.toLowerCase().includes(searchLower);
            const matchFamily = card.family?.name?.toLowerCase().includes(searchLower);
            const matchAffinity = card.affinity?.name?.toLowerCase().includes(searchLower);
            const matchType = card.type?.toLowerCase().includes(searchLower);
            return matchName || matchDesc || matchFamily || matchAffinity || matchType;
        });
    }
    if (filters.rarity && filters.rarity.length > 0) {
        collection = collection.filter((card) => filters.rarity?.includes(card.rarity));
    }
    if (filters.type && filters.type.length > 0) {
        collection = collection.filter((card) => filters.type?.includes(card.type));
    }
    if (filters.serie && filters.serie.length > 0) {
        collection = collection.filter((card) => filters.serie?.includes(card.serie?.id_serie.name));
    }
    return (0, Result_1.ok)(collection.map(card_mapper_1.mapCard));
}
//# sourceMappingURL=card.fetch.js.map