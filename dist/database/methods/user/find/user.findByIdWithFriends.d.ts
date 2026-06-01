import { Result } from "../../../../shared/Result";
import { PopulatedUserFriendsDocument } from "../../../interfaces/user.interface";
export declare function findByIdWithFriends(userId: string): Promise<Result<PopulatedUserFriendsDocument["friends"], string>>;
