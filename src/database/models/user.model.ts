import { Schema, model, Document, Types } from "mongoose";

export interface BoosterEntry {
  booster: Types.ObjectId;
  number: number;
}

export interface UserDocument extends Document {
  pseudo: string;
  email: string;
  avatar: string;
  passwordHash: string;
  money: number;
  countdownEnds: Date;
  myCollection: Types.ObjectId[];
  boosters: BoosterEntry[];
  decks: Types.ObjectId[];
  friends: Types.ObjectId[];
  darkMode: boolean;
}

const userSchema = new Schema({
  pseudo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: "" },
  passwordHash: { type: String, required: true },
  money: { type: Number, default: 0 },
  countdownEnds: {type : Date, default:""},
  myCollection: [{ type: Schema.Types.ObjectId, ref: "Card", default: [] }],
  boosters: [
    {
      booster: { type: Schema.Types.ObjectId, ref: "Booster", required: true },
      number: { type: Number, required: true, default: 1 },
    },
  ],
  decks: [{ type: Schema.Types.ObjectId, ref: "Deck", default: [] }],
  friends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  darkMode: { type: Boolean, default: false },
});

export const UserModel = model<UserDocument>("User", userSchema);
