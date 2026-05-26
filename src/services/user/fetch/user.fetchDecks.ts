import { Result, ok, err } from "@shared/Result";
import { fetchDecks } from "@database/methods/user";
import { DeckDocument } from "@database/models/deck.model";

type FetchDecksError = "USER_NOT_FOUND" | "DATABASE_ERROR";

export async function fetchUserDecks(
  userId: string,
): Promise<Result<DeckDocument[], FetchDecksError>> {
  const result = await fetchDecks(userId);
  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") return err("USER_NOT_FOUND");
    return err("DATABASE_ERROR");
  }
  return ok(result.value);
}
