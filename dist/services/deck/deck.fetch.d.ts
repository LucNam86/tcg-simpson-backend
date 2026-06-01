import { PublicDeck } from "../../database/mapper/deck.mapper";
import { Result } from "../../shared/Result";
type FetchDecksError = "USER_NOT_FOUND" | "DATABASE_ERROR";
export declare function fetchUserDecks(userId: string): Promise<Result<PublicDeck[], FetchDecksError>>;
export {};
