import { Result } from "../../../../shared/Result";
import { PopulatedUserDecksDocument } from "../../../interfaces/user.interface";
export declare function findByIdWithDecks(userId: string): Promise<Result<PopulatedUserDecksDocument, string>>;
