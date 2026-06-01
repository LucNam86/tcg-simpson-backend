"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserCollection = fetchUserCollection;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const mapper_1 = require("../../database/mapper");
async function fetchUserCollection(id, filters) {
    const result = await (0, user_1.findByIdWithCollection)(id);
    if (!result.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!result.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    let collection = result.value.myCollection || [];
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
    return (0, Result_1.ok)(collection.map(mapper_1.mapCard));
}
//# sourceMappingURL=card.fetchCollection.js.map