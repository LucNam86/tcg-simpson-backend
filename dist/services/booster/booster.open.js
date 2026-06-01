"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openBooster = openBooster;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const card_mapper_1 = require("../../database/mapper/card.mapper");
const pickRarity = (probabilities) => {
    const roll = Math.random() * 100;
    let cumulative = 0;
    const sortedProbabilities = [...probabilities].sort((a, b) => a.value - b.value);
    for (const probability of sortedProbabilities) {
        cumulative += probability.value;
        if (roll < cumulative)
            return probability.rarity;
    }
    return sortedProbabilities[sortedProbabilities.length - 1]?.rarity || "Common";
};
const pickCards = (cards, probabilities, packSize) => {
    const result = [];
    const rarityMapping = {
        Common: "1",
        Rare: "2",
        Legendary: "3",
    };
    for (let i = 0; i < packSize; i++) {
        const rarityText = pickRarity(probabilities);
        const targetRarityId = rarityMapping[rarityText];
        const cardsOfRarity = cards.filter((card) => card.rarity === targetRarityId);
        const pool = cardsOfRarity.length > 0 ? cardsOfRarity : cards;
        const picked = pool[Math.floor(Math.random() * pool.length)];
        result.push(picked);
    }
    return result;
};
async function openBooster(userId, boosterId) {
    const userResult = await (0, user_1.findByIdWithBoosters)(userId);
    if (!userResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!userResult.value)
        return (0, Result_1.err)("USER_NOT_FOUND");
    const userBooster = userResult.value.boosters.find((ub) => ub.booster._id.toString() === boosterId);
    if (!userBooster)
        return (0, Result_1.err)("BOOSTER_NOT_FOUND");
    if (userBooster.number <= 0)
        return (0, Result_1.err)("NO_BOOSTER_AVAILABLE");
    const rawCards = userBooster.booster.cards;
    const packSize = userBooster.booster.quantity || 5;
    const pickedRawCards = pickCards(rawCards, userBooster.booster.probabilities, packSize);
    const saveResult = await (0, user_1.saveCardsToCollection)(userId, boosterId, pickedRawCards);
    if (!saveResult.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    console.log(`\n🎰 [BOOSTER OPENED] - ${userBooster.booster.name}`);
    console.log(`Distribution obtenue :`, pickedRawCards.map((c) => `Rareté [${c.rarity}] - ${c.name}`));
    return (0, Result_1.ok)(pickedRawCards.map(card_mapper_1.mapCard));
}
//# sourceMappingURL=booster.open.js.map