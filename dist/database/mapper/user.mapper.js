"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFriend = exports.mapUser = void 0;
exports.mapUserPublic = mapUserPublic;
const card_mapper_1 = require("./card.mapper");
const booster_mapper_1 = require("./booster.mapper");
const mapUser = (user) => ({
    id: user._id.toString(),
    pseudo: user.pseudo,
    email: user.email,
    avatar: user.avatar,
    money: user.money,
    countdownEnds: user.countdownEnds,
    myCollection: user.myCollection.map(card_mapper_1.mapCard),
    boosters: (0, booster_mapper_1.mapUserBoosters)(user.boosters),
    decks: user.decks,
    friends: user.friends.map((friend) => (0, exports.mapFriend)(friend)),
    darkMode: user.darkMode,
});
exports.mapUser = mapUser;
function mapUserPublic(user) {
    return {
        id: user._id.toString(),
        pseudo: user.pseudo,
        email: user.email,
        avatar: user.avatar,
        money: user.money,
        countdownEnds: user.countdownEnds,
        darkMode: user.darkMode,
    };
}
const mapFriend = (friend) => {
    const uniqueCardsCount = friend.myCollection
        ? new Set(friend.myCollection.map((cardId) => cardId.toString())).size
        : 0;
    return {
        pseudo: friend.pseudo,
        avatar: friend.avatar,
        uniqueCardsCount,
    };
};
exports.mapFriend = mapFriend;
//# sourceMappingURL=user.mapper.js.map