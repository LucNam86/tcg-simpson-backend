import { Result, ok, err } from "@shared/Result";
import { findByManyPseudo } from "@database/methods/user";
import { PublicFriend } from "./user.fetchFriends";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";

export async function fetchPseudosAutocomplete(
  query: string,
  excludeUserId: string,
): Promise<Result<PublicFriend[], GetUserError>> {
  const result = await findByManyPseudo(query, excludeUserId);
  if (!result.ok) return err("DATABASE_ERROR");
  return ok(result.value as PublicFriend[]);
}
