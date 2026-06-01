import { Result } from "../../shared/Result";
type UpdateUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "PSEUDO_ALREADY_USED";
interface UpdateInput {
    pseudo?: string;
    password?: string;
    money?: number;
    avatar?: string;
}
interface UpdatedUser {
    pseudo: string;
    money: number;
}
export declare function updateUser(id: string, input: UpdateInput): Promise<Result<UpdatedUser, UpdateUserError>>;
export {};
