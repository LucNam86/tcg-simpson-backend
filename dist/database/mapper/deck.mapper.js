"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDeck = mapDeck;
const card_mapper_1 = require("./card.mapper");
function mapDeck(deck) {
    return {
        id: deck._id.toString(),
        name: deck.name,
        cards: deck.cards.map(card_mapper_1.mapCard),
        isActive: deck.isActive,
    };
}
//# sourceMappingURL=deck.mapper.js.map