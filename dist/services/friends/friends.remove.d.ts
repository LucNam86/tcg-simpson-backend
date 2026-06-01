import { Result } from "../../shared/Result";
type RemoveFriendError = "USER_NOT_FOUND" | "DATABASE_ERROR";
export declare function removeUserFriendByPseudo(userId: string, friendPseudo: string): Promise<Result<boolean, RemoveFriendError>>;
export {};
