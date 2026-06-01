import { Result } from "../../shared/Result";
type CreateDeckError = "USER_NOT_FOUND" | "MAX_DECKS_REACHED" | "INVALID_CARD_COUNT" | "DATABASE_ERROR";
export interface PublicDeckBasic {
    id: string;
    name: string;
    isActive: boolean;
    cards: string[];
}
export declare function addDeck(input: {
    userId: string;
    name: string;
    cards: string[];
}): Promise<Result<PublicDeckBasic, CreateDeckError>>;
export {};
