import { Result } from "../../../shared/Result";
type DbResultError = "DATABASE_ERROR";
export declare const deleteFriendById: (userId: string, friendId: string) => Promise<Result<boolean, DbResultError>>;
export {};
