import { Result } from "../../../../shared/Result";
import { PopulatedUserBoostersDocument } from "../../../interfaces/user.interface";
export declare function findByIdWithBoosters(id: string): Promise<Result<PopulatedUserBoostersDocument, string>>;
