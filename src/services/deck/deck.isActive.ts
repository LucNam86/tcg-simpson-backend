

import { Result, ok, err } from "@shared/Result";
import { DeckModel } from "@database/models/deck.model";
import { Types } from "mongoose";

export type DeckOperationError =
  | "USER_NOT_FOUND"
  | "DECK_NOT_FOUND"
  | "UNAUTHORIZED_DECK"
  | "INVALID_CARD_COUNT"
  | "DATABASE_ERROR";

export const setActiveDeck = async (
  userId: string,
  deckId: string
): Promise<Result<void, DeckOperationError>> => {
  try {
    const deck = await DeckModel.findById(deckId);
    if (!deck) return err("DECK_NOT_FOUND");
    if (deck.user.toString() !== userId) return err("UNAUTHORIZED_DECK");

    await DeckModel.updateMany({ user: new Types.ObjectId(userId) }, { isActive: false });

    deck.isActive = true;
    await deck.save();

    return ok(undefined);
  } catch (error) {
    console.error("Erreur setActiveDeck service :", error);
    return err("DATABASE_ERROR");
  }
};