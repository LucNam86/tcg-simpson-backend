// database/interfaces/user.interface.ts
import { UserDocument } from "@database/models/user.model";
import { DeckDocument } from "@database/models/deck.model";
import { Types } from "mongoose";
import type { PopulatedCardDocument } from "./card.interface";
import type { PopulatedBoosterDocument } from "./booster.interface";

export interface PopulatedDeckDocument extends Omit<DeckDocument, "cards"> {
  cards: PopulatedCardDocument[];
}

export interface PopulatedUserCollectionDocument extends Omit<UserDocument, "myCollection"> {
  myCollection: PopulatedCardDocument[];
}

export interface PopulatedUserBoostersDocument extends Omit<UserDocument, "boosters"> {
  boosters: {
    booster: PopulatedBoosterDocument;
    number: number;
  }[];
}

export interface PopulatedUserDecksDocument extends Omit<UserDocument, "decks"> {
  decks: PopulatedDeckDocument[];
}

export interface PopulatedUserFriendsDocument extends Omit<UserDocument, "friends"> {
  friends: {
    _id: Types.ObjectId;
    pseudo: string;
    avatar: string;
    myCollection: Types.ObjectId[];
  }[];
}