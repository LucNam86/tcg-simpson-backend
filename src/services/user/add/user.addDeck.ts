import { Result, ok, err } from "@shared/Result";
import { DeckModel, DeckDocument } from "@database/models/deck.model";
import { UserModel } from "@database/models/user.model";
import { Types } from "mongoose";

type AddDeckError =
  | "USER_NOT_FOUND"
  | "MAX_DECKS_REACHED"
  | "INVALID_CARD_COUNT"
  | "DATABASE_ERROR";

interface AddDeckInput {
  userId: string;
  name: string;
  cards: string[];
}

export const addDeck = async (
  input: AddDeckInput,
): Promise<Result<DeckDocument, AddDeckError>> => {
  try {
    const user = await UserModel.findById(input.userId);
    if (!user) return err("USER_NOT_FOUND");

    // Vérification de la limite de decks
    if (user.decks && user.decks.length >= 3) {
      return err("MAX_DECKS_REACHED");
    }

    // Vérification du nombre de cartes
    if (input.cards.length !== 10) {
      return err("INVALID_CARD_COUNT");
    }

    // Création du nouveau deck
    const newDeck = new DeckModel({
      name: input.name || "Mon Super Deck",
      cards: input.cards.map((id) => new Types.ObjectId(id)),
      user: new Types.ObjectId(input.userId),
      isActive: !user.decks || user.decks.length === 0,
    });

    await newDeck.save();

    await UserModel.updateOne(
      { _id: input.userId },
      { $push: { decks: newDeck._id } },
    );

    return ok(newDeck);
  } catch (error) {
    console.error("Erreur addDeck service :", error);
    return err("DATABASE_ERROR");
  }
};