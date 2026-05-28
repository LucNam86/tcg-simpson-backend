import { Result, ok, err } from "@shared/Result";
import { deleteDeck } from "@database/methods/deck";

type RemoveDeckError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "DECK_NOT_FOUND" | "UNAUTHORIZED_DECK";

export async function removeUserDeck(
  userId: string,
  deckId: string,
): Promise<Result<void, RemoveDeckError>> {
  const result = await deleteDeck(userId, deckId);

  if (!result.ok) {
    if (result.error === "DECK_NOT_FOUND") return err("DECK_NOT_FOUND");
    if (result.error === "UNAUTHORIZED_DECK") return err("UNAUTHORIZED_DECK");
    return err("DATABASE_ERROR");
  }

  return ok(undefined);
}