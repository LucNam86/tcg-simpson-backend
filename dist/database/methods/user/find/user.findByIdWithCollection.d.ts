import { Result } from "../../../../shared/Result";
import { PopulatedUserCollectionDocument } from "../../../interfaces/user.interface";
export declare function findByIdWithCollection(id: string): Promise<Result<PopulatedUserCollectionDocument, string>>;
