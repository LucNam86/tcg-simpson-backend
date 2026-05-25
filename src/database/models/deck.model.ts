import { Schema, model, Document, Types } from "mongoose";

export interface DeckDocument extends Document {
  name: string;
  cards: Types.ObjectId[];
  isActive: boolean;
  user: Types.ObjectId;
}

const deckSchema = new Schema({
  name: { type: String, required: true },
  cards: [{ type: Schema.Types.ObjectId, ref: "Card", required: true }],
  isActive: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const DeckModel = model<DeckDocument>("Deck", deckSchema);
