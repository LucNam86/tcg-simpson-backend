import { Result, ok, err } from "@shared/Result";
import { updateActiveDeck } from "@database/methods/deck/deck.updateActiveDeck";

export type DeckOperationError =
  | "USER_NOT_FOUND"
  | "DECK_NOT_FOUND"
  | "UNAUTHORIZED_DECK"
  | "INVALID_CARD_COUNT"
  | "DATABASE_ERROR";

export async function activateDeck(
  userId: string,
  deckId: string,
): Promise<Result<void, DeckOperationError>> {
  const result = await updateActiveDeck(userId, deckId);

  if (!result.ok) {
    if (result.error === "DECK_NOT_FOUND") return err("DECK_NOT_FOUND");
    if (result.error === "UNAUTHORIZED_DECK") return err("UNAUTHORIZED_DECK");
    return err("DATABASE_ERROR");
}
  return ok(undefined);
}