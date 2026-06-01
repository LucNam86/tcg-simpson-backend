import { Result } from "../../shared/Result";
type AddFriendError = "USER_NOT_FOUND" | "CANT_ADD_SELF" | "DATABASE_ERROR";
export declare function addUserFriend(userId: string, friendPseudo: string): Promise<Result<boolean, AddFriendError>>;
export {};
