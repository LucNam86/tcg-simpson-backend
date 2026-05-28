import { Result, ok, err } from "@shared/Result";
import { DeckModel } from "@database/models/deck.model";
import { UserModel } from "@database/models/user.model";
import { Types } from "mongoose";

export async function deleteDeck(
  userId: string,
  deckId: string,
): Promise<Result<void, string>> {
  try {
    const deck = await DeckModel.findById(deckId);
    if (!deck) return err("DECK_NOT_FOUND");
    if (deck.user.toString() !== userId) return err("UNAUTHORIZED_DECK");

    await DeckModel.deleteOne({ _id: new Types.ObjectId(deckId) });

    await UserModel.updateOne(
      { _id: new Types.ObjectId(userId) },
      { $pull: { decks: new Types.ObjectId(deckId) } }
    );

    return ok(undefined);
  } catch (error) {
    console.error("Erreur BDD deleteDeck:", error);
    return err("DATABASE_ERROR");
  }
}