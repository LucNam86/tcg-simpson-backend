import { Result } from "../../shared/Result";
type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";
export interface PublicFriend {
    pseudo: string;
    avatar: string;
}
export declare function fetchUserFriends(id: string): Promise<Result<PublicFriend[], GetUserError>>;
export {};
