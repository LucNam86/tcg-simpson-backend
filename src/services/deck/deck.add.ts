import { Result, ok, err } from "@shared/Result";
import { saveDeck } from "@database/methods/deck";

type CreateDeckError = "USER_NOT_FOUND" | "MAX_DECKS_REACHED" | "INVALID_CARD_COUNT" | "DATABASE_ERROR";

export interface PublicDeckBasic {
  id: string;
  name: string;
  isActive: boolean;
  cards: string[];
}

export async function addDeck(input: {
  userId: string;
  name: string;
  cards: string[];
}): Promise<Result<PublicDeckBasic, CreateDeckError>> {
  const result = await saveDeck(input);
  if (!result.ok) return err(result.error);

  return ok({
    id: result.value._id.toString(),
    name: result.value.name,
    isActive: result.value.isActive,
    cards: input.cards,
  });
}