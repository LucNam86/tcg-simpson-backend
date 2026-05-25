import { Result, ok, err } from "@shared/Result";
import { DeckModel, DeckDocument } from "@database/models/deck.model";
import { UserModel } from "@database/models/user.model";
import { Types } from "mongoose";

type CreateDeckError =
  | "USER_NOT_FOUND"
  | "MAX_DECKS_REACHED"
  | "INVALID_CARD_COUNT"
  | "DATABASE_ERROR";

interface CreateDeckInput {
  userId: string;
  name: string;
  cards: string[];
}

export const createDeck = async (
  input: CreateDeckInput,
): Promise<Result<DeckDocument, CreateDeckError>> => {
  try {
    const user = await UserModel.findById(input.userId);
    if (!user) return err("USER_NOT_FOUND");

    if (user.decks.length >= 3) {
      return err("MAX_DECKS_REACHED");
    }

    if (input.cards.length !== 10) {
      return err("INVALID_CARD_COUNT");
    }

    const newDeck = new DeckModel({
      name: input.name || "Mon Super Deck",
      cards: input.cards.map((id) => new Types.ObjectId(id)),
      user: new Types.ObjectId(input.userId),
      isActive: user.decks.length === 0,
    });

    await newDeck.save();

    user.decks.push(newDeck._id as Types.ObjectId);
    await user.save();

    return ok(newDeck);
  } catch (error) {
    console.error("Erreur createDeck service :", error);
    return err("DATABASE_ERROR");
  }
};
