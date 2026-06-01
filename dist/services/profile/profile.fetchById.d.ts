import { Result } from "../../shared/Result";
import { mapUser } from "../../database/mapper";
type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR";
export declare function fetchUserById(id: string): Promise<Result<ReturnType<typeof mapUser>, GetUserError>>;
export {};
