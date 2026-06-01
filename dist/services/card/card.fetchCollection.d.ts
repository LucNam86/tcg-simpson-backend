import { Result } from "../../shared/Result";
import { mapCard } from "../../database/mapper";
type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR";
type MappedCard = ReturnType<typeof mapCard>;
export declare function fetchUserCollection(id: string, filters: {
    q?: string;
    rarity?: string[];
    type?: string[];
    serie?: string[];
}): Promise<Result<MappedCard[], GetUserError>>;
export {};
