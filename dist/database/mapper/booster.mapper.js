"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBoostersFromFind = exports.mapUserBoosters = exports.mapBooster = void 0;
const card_mapper_1 = require("../mapper/card.mapper");
const mapBooster = (booster) => ({
    id: booster._id.toString(),
    name: booster.name,
    price: booster.price,
    slug: booster.slug,
    quantity: booster.quantity,
    cards: booster.cards.map(card_mapper_1.mapCard),
    serie: { id: booster.serie._id.toString(), name: booster.serie.name },
    probabilities: booster.probabilities.map((probability) => ({
        rarity: probability.rarity,
        value: probability.value,
    })),
});
exports.mapBooster = mapBooster;
const mapUserBoosters = (boosters) => boosters.map((entry) => ({ booster: (0, exports.mapBooster)(entry.booster), number: entry.number }));
exports.mapUserBoosters = mapUserBoosters;
const mapBoostersFromFind = (boosters) => boosters.map((booster) => ({ booster: (0, exports.mapBooster)(booster), number: 1 }));
exports.mapBoostersFromFind = mapBoostersFromFind;
//# sourceMappingURL=booster.mapper.js.map