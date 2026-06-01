import { Result } from "../../shared/Result";
export interface PublicFriend {
    pseudo: string;
    avatar: string;
}
type GetUserError = "DATABASE_ERROR";
export declare function fetchPseudosAutocomplete(query: string, excludeUserId: string): Promise<Result<PublicFriend[], GetUserError>>;
export {};
