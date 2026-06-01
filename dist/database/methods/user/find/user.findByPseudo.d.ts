import { Result } from "../../../../shared/Result";
import { UserDocument } from "../../../models/user.model";
export declare function findByPseudo(pseudo: string): Promise<Result<UserDocument | null, string>>;
