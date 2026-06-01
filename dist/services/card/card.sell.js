"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellCollectionCards = sellCollectionCards;
const Result_1 = require("../../shared/Result");
const user_1 = require("../../database/methods/user");
const user_updateMoneyById_1 = require("../../database/methods/user/update/user.updateMoneyById");
const RARITY_PRICES = {
    "1": 5,
    "2": 25,
    "3": 50,
};
async function sellCollectionCards(userId, cardId, count) {
    const result = await (0, user_1.findByIdWithCollection)(userId);
    if (!result.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    const userDoc = result.value;
    if (!userDoc)
        return (0, Result_1.err)("USER_NOT_FOUND");
    let myCollection = userDoc.myCollection || [];
    const targetCard = myCollection.find((card) => (card._id || card.id)?.toString() === cardId);
    if (!targetCard)
        return (0, Result_1.err)("INSUFFICIENT_QUANTITY");
    const pricePerCard = RARITY_PRICES[targetCard.rarity] || 5;
    const earnedDonuts = pricePerCard * count;
    const currentOwnedCount = myCollection.filter((card) => (card._id || card.id)?.toString() === cardId).length;
    if (currentOwnedCount - count < 1)
        return (0, Result_1.err)("INSUFFICIENT_QUANTITY");
    let removed = 0;
    const updatedCollection = myCollection.filter((card) => {
        const currentCardId = (card._id || card.id)?.toString();
        if (currentCardId === cardId && removed < count) {
            removed++;
            return false;
        }
        return true;
    });
    const collectionIds = updatedCollection.map((card) => card._id || card.id || card);
    const updateResult = await (0, user_1.updateById)(userId, { myCollection: collectionIds });
    if (!updateResult.ok)
        return (0, Result_1.err)("SERVER_ERROR");
    const newMoney = (userDoc.money || 0) + earnedDonuts;
    const moneyResult = await (0, user_updateMoneyById_1.updateMoneyById)(userId, newMoney);
    if (!moneyResult.ok)
        return (0, Result_1.err)("SERVER_ERROR");
    return (0, Result_1.ok)({ earnedDonuts, money: moneyResult.value });
}
//# sourceMappingURL=card.sell.js.map