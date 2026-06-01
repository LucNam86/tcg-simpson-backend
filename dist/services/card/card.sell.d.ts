import { Result } from "../../shared/Result";
type SellCardError = "DATABASE_ERROR" | "USER_NOT_FOUND" | "INSUFFICIENT_QUANTITY" | "SERVER_ERROR";
interface SellResult {
    earnedDonuts: number;
    money: number;
}
export declare function sellCollectionCards(userId: string, cardId: string, count: number): Promise<Result<SellResult, SellCardError>>;
export {};
