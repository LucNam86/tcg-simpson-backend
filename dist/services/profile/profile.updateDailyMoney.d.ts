import { Result } from "../../shared/Result";
type ClaimDailyError = "USER_NOT_FOUND" | "NOT_READY" | "DATABASE_ERROR";
interface ClaimDailyResult {
    money: number;
    countdownEnds: string;
}
export declare function updateDailyMoney(userId: string): Promise<Result<ClaimDailyResult, ClaimDailyError>>;
export {};
