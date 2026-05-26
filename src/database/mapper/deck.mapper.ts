// database/mapper/deck.mapper.ts
import { PopulatedDeckDocument } from "@database/interfaces/user.interface";
import { mapCard } from "./card.mapper";

export interface PublicDeck {
  id: string;
  name: string;
  cards: ReturnType<typeof mapCard>[];
  isActive: boolean;
}

export function mapDeck(deck: PopulatedDeckDocument): PublicDeck {
  return {
    id: deck._id.toString(),
    name: deck.name,
    cards: deck.cards.map(mapCard),
    isActive: deck.isActive,
  };
}