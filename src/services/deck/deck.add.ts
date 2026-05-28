import { Result, ok, err } from "@shared/Result";
import { saveDeck } from "@database/methods/deck";
import { findById } from "@database/methods/user";

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
  if (input.cards.length !== 10) return err("INVALID_CARD_COUNT");

  const userResult = await findById(input.userId);
  if (!userResult.ok) return err("DATABASE_ERROR");
  if (!userResult.value) return err("USER_NOT_FOUND");

  if (userResult.value.decks.length >= 3) return err("MAX_DECKS_REACHED");

  const result = await saveDeck({
    userId: input.userId,
    name: input.name || "Mon Super Deck",
    cards: input.cards,
    isActive: userResult.value.decks.length === 0,
  });

  if (!result.ok) return err("DATABASE_ERROR");

  return ok({
    id: result.value._id.toString(),
    name: result.value.name,
    isActive: result.value.isActive,
    cards: input.cards,
  });
}