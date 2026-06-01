import { Result } from "../../shared/Result";
import { mapCard } from "../../database/mapper/card.mapper";
type GetCardError = "DATABASE_ERROR" | "NO_CARDS";
type MappedCard = ReturnType<typeof mapCard>;
export declare function fetchCards(filters: {
    q?: string;
    rarity?: string[];
    type?: string[];
    serie?: string[];
}): Promise<Result<MappedCard[], GetCardError>>;
export {};
