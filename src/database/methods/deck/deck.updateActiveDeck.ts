import { Result, ok, err } from "@shared/Result";
import { DeckModel } from "@database/models/deck.model";
import { Types } from "mongoose";


export async function updateActiveDeck(
  userId: string,
  deckId: string
): Promise<Result<void, string>> {
  try {
    const deck = await DeckModel.findById(deckId);
    if (!deck) return err("DECK_NOT_FOUND");
    if (deck.user.toString() !== userId) return err("UNAUTHORIZED_DECK");

    await DeckModel.updateMany({ user: new Types.ObjectId(userId) }, { isActive: false });

    deck.isActive = true;
    await deck.save();

    return ok(undefined);
  } catch (error) {
    console.error("Erreur updateActiveDeck:", error);
    return err("DATABASE_ERROR");
  }
}