import { Result } from "../../../../shared/Result";
import { UserDocument } from "../../../models/user.model";
export declare const updateById: (id: string, updateData: Partial<UserDocument>) => Promise<Result<UserDocument | null, string>>;
