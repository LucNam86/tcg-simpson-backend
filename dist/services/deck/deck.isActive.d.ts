import { Result } from "../../shared/Result";
export type DeckOperationError = "USER_NOT_FOUND" | "DECK_NOT_FOUND" | "UNAUTHORIZED_DECK" | "INVALID_CARD_COUNT" | "DATABASE_ERROR";
export declare function activateDeck(userId: string, deckId: string): Promise<Result<void, DeckOperationError>>;
