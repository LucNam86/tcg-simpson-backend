import { PopulatedCardDocument } from "../../../interfaces/card.interface";
import { Result } from "../../../../shared/Result";
export declare const saveCardsToCollection: (userId: string, boosterId: string, cards: PopulatedCardDocument[]) => Promise<Result<void, string>>;
