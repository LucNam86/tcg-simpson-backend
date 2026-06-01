import { Result } from "../../shared/Result";
import { mapCard } from "../../database/mapper/card.mapper";
type OpenBoosterError = "DATABASE_ERROR" | "USER_NOT_FOUND" | "NO_BOOSTER_AVAILABLE" | "BOOSTER_NOT_FOUND";
type MappedCard = ReturnType<typeof mapCard>;
export declare function openBooster(userId: string, boosterId: string): Promise<Result<MappedCard[], OpenBoosterError>>;
export {};
