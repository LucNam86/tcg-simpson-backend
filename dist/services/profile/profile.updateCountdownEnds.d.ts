import { Result } from "../../shared/Result";
type UpdateCountdownEndsError = "USER_NOT_FOUND" | "DATABASE_ERRORE";
export declare function updateCountdown(userId: string, countdownEnds: Date): Promise<Result<Date, UpdateCountdownEndsError>>;
export {};
