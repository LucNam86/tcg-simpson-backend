import { Result } from "../../shared/Result";
import { mapBooster } from "../../database/mapper/booster.mapper";
type GetBoosterError = "DATABASE_ERROR" | "UNKNOWN_BOOSTER";
export declare function fetchBoosters(): Promise<Result<ReturnType<typeof mapBooster>[], GetBoosterError>>;
export {};
