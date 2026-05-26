import { Result, ok, err } from "@shared/Result";
import { findByIdWithFriends } from "@database/methods/user";
import { mapFriend } from "@database/mapper";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";

export interface PublicFriend {
  pseudo: string;
  avatar: string;
}

export async function fetchUserFriends(
  id: string,
): Promise<Result<PublicFriend[], GetUserError>> {
  const result = await findByIdWithFriends(id);
  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");
  return ok(result.value.map(mapFriend));
}
