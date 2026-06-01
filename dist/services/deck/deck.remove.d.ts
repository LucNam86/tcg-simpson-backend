import { Result } from "../../shared/Result";
type RemoveDeckError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "DECK_NOT_FOUND" | "UNAUTHORIZED_DECK";
export declare function removeUserDeck(userId: string, deckId: string): Promise<Result<void, RemoveDeckError>>;
export {};
