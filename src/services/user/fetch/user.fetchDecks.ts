import { mapDeck, PublicDeck } from "@database/mapper/deck.mapper";
import { Result, ok, err } from "@shared/Result";
import { findByIdWithDecks } from "@database/methods/user";

type FetchDecksError = "USER_NOT_FOUND" | "DATABASE_ERROR";

export async function fetchUserDecks(
  userId: string,
): Promise<Result<PublicDeck[], FetchDecksError>> {
  const result = await findByIdWithDecks(userId);
  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") return err("USER_NOT_FOUND");
    return err("DATABASE_ERROR");
  }
  return ok(result.value.decks.map(mapDeck));
}