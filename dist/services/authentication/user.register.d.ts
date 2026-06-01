import { Result } from "../../shared/Result";
import { mapUserPublic } from "../../database/mapper/user.mapper";
type RegisterError = "EMAIL_TAKEN" | "PSEUDO_TAKEN" | "USER_CREATION_FAILED" | "DATABASE_ERROR";
interface RegisterInput {
    pseudo: string;
    email: string;
    password: string;
}
export declare function registerUser(input: RegisterInput): Promise<Result<ReturnType<typeof mapUserPublic>, RegisterError>>;
export {};
