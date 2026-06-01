import { Result } from "../../shared/Result";
import { mapUserPublic } from "../../database/mapper/user.mapper";
type ConnectError = "CREDENTIALS_UNKNOWN" | "WRONG_CREDENTIALS" | "DATABASE_ERROR";
interface ConnectInput {
    email: string;
    password: string;
}
export declare function connectUser(input: ConnectInput): Promise<Result<ReturnType<typeof mapUserPublic>, ConnectError>>;
export {};
