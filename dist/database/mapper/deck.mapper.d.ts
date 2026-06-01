import { PopulatedDeckDocument } from "../interfaces/user.interface";
import { mapCard } from "./card.mapper";
export interface PublicDeck {
    id: string;
    name: string;
    cards: ReturnType<typeof mapCard>[];
    isActive: boolean;
}
export declare function mapDeck(deck: PopulatedDeckDocument): PublicDeck;
