import { Result } from "../../shared/Result";
export declare function addMoney(userId: string, amount: number): Promise<Result<number, "USER_NOT_FOUND" | "DATABASE_ERROR">>;
