import { Result } from "../../shared/Result";
type UpdateDeckError = "DECK_NOT_FOUND" | "UNAUTHORIZED_DECK" | "INVALID_CARD_COUNT" | "DATABASE_ERROR";
export interface PublicDeckBasic {
    id: string;
    name: string;
    isActive: boolean;
    cards: string[];
}
export declare function updateDeck(userId: string, deckId: string, input: {
    name?: string;
    cards?: string[];
}): Promise<Result<PublicDeckBasic, UpdateDeckError>>;
export {};
