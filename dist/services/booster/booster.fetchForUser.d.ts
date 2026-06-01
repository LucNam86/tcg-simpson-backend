import { Result } from "../../shared/Result";
import { mapUserBoosters } from "../../database/mapper";
type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR";
export declare function fetchUserBoosters(userId: string): Promise<Result<ReturnType<typeof mapUserBoosters>, GetUserError>>;
export {};
