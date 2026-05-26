import { Result, ok, err } from "@shared/Result";
import { deleteDeck } from "@database/methods/user";

type RemoveDeckError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "DECK_NOT_FOUND" | "UNAUTHORIZED_DECK";

export async function removeUserDeck(
  userId: string,
  deckId: string,
): Promise<Result<void, RemoveDeckError>> {
  const result = await deleteDeck(userId, deckId);

  if (!result.ok) return err(result.error);

  return ok(undefined);
}