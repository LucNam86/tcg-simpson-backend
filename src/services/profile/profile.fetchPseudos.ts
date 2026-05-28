import { Result, ok, err } from "@shared/Result";
import { findByManyPseudo } from "@database/methods/user";

export interface PublicFriend {
  pseudo: string;
  avatar: string;
}

type GetUserError = "DATABASE_ERROR";

export async function fetchPseudosAutocomplete(
  query: string,
  excludeUserId: string,
): Promise<Result<PublicFriend[], GetUserError>> {
  const result = await findByManyPseudo(query, excludeUserId);
  if (!result.ok) return err("DATABASE_ERROR");
  return ok(result.value as PublicFriend[]);
}