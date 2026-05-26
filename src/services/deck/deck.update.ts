import { Result, ok, err } from "@shared/Result";
import { DeckModel, DeckDocument } from "@database/models/deck.model";
import { Types } from "mongoose";


export type DeckOperationError =
  | "DECK_NOT_FOUND"
  | "UNAUTHORIZED_DECK"
  | "INVALID_CARD_COUNT"
  | "DATABASE_ERROR";

export const updateDeck = async (
  userId: string,
  deckId: string,
  input: { name?: string; cards?: string[] }
): Promise<Result<DeckDocument, DeckOperationError>> => {
  try {
    const deck = await DeckModel.findById(deckId);
    if (!deck) return err("DECK_NOT_FOUND");
    if (deck.user.toString() !== userId) return err("UNAUTHORIZED_DECK");

    if (input.name) deck.name = input.name;
    if (input.cards) {
      if (input.cards.length !== 10) return err("INVALID_CARD_COUNT");
      deck.cards = input.cards.map((id) => new Types.ObjectId(id));
    }

    await deck.save();
    return ok(deck);
  } catch (error) {
    console.error("Erreur updateDeck service :", error);
    return err("DATABASE_ERROR");
  }
};