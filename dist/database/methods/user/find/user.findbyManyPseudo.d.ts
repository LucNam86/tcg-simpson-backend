import { Result } from "../../../../shared/Result";
import { UserDocument } from "../../../models/user.model";
export declare function findByManyPseudo(query: string, excludeUserId: string): Promise<Result<Pick<UserDocument, "pseudo" | "avatar">[], string>>;
