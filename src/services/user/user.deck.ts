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
    console.error("Erreur createDeck service :", error);
    return err("DATABASE_ERROR");
  }
};

export type DeckOperationError =
  | "USER_NOT_FOUND"
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

export const deleteDeck = async (
  userId: string,
  deckId: string
): Promise<Result<void, DeckOperationError>> => {
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
    console.error("Erreur deleteDeck service :", error);
    return err("DATABASE_ERROR");
  }
};
