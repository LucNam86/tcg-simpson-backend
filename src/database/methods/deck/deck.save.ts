import { Result, ok, err } from "@shared/Result";
import { DeckModel, DeckDocument } from "@database/models/deck.model";
import { UserModel } from "@database/models/user.model";
import { Types } from "mongoose";
import { SaveDeckInput } from "@database/interfaces/deck.interface";

export async function saveDeck(
  input: SaveDeckInput,
): Promise<Result<DeckDocument, string>> {
  try {
    const newDeck = new DeckModel({
      name: input.name,
      cards: input.cards.map((id) => new Types.ObjectId(id)),
      user: new Types.ObjectId(input.userId),
      isActive: input.isActive,
    });

    await newDeck.save();

    await UserModel.updateOne(
      { _id: input.userId },
      { $push: { decks: newDeck._id } },
    );

    return ok(newDeck);
  } catch (error) {
    console.error("Erreur saveDeck:", error);
    return err("DATABASE_ERROR");
  }
}