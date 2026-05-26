import { Result, ok, err } from "@shared/Result";
import { updateById } from "@database/methods/deck/deck.updateById";
import { Types } from "mongoose";

type UpdateDeckError = "DECK_NOT_FOUND" | "UNAUTHORIZED_DECK" | "INVALID_CARD_COUNT" | "DATABASE_ERROR";

export interface PublicDeckBasic {
  id: string;
  name: string;
  isActive: boolean;
  cards: string[];
}

export async function updateDeck(
  userId: string,
  deckId: string,
  input: { name?: string; cards?: string[] },
): Promise<Result<PublicDeckBasic, UpdateDeckError>> {
  const result = await updateById(userId, deckId, input);
  if (!result.ok) {
    if (result.error === "DECK_NOT_FOUND") return err("DECK_NOT_FOUND");
    if (result.error === "UNAUTHORIZED_DECK") return err("UNAUTHORIZED_DECK");
    if (result.error === "INVALID_CARD_COUNT") return err("INVALID_CARD_COUNT");
    return err("DATABASE_ERROR");
  }

  return ok({
    id: result.value._id.toString(),
    name: result.value.name,
    isActive: result.value.isActive,
    cards: result.value.cards.map((card: Types.ObjectId) => card.toString()),
  });
}