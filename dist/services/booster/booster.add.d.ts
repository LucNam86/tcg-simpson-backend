import { Result } from "../../shared/Result";
type AddBoosterError = "USER_NOT_FOUND" | "BOOSTER_NOT_FOUND" | "NOT_ENOUGH_MONEY" | "DATABASE_ERROR";
interface AddBoosterResult {
    money: number;
}
export declare function addBooster(userId: string, boosterId: string): Promise<Result<AddBoosterResult, AddBoosterError>>;
export {};
