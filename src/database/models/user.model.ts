import { Schema, model, Document } from "mongoose";

export interface UserDocument extends Document {
  pseudo: string;
  email: string;
  avatar: string;
  passwordHash: string;
  money: number;
  myCollection: { type: Schema.Types.ObjectId, ref: "Card", default: [] };
  boosters: string[];
  deck: { type: Schema.Types.ObjectId, ref: "Card", default: [] };
  darkMode: boolean;
}

const userSchema = new Schema({
  pseudo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: "" },
  passwordHash: { type: String, required: true },
  money: { type: Number, default: 0 },
  myCollection: [{ type: Schema.Types.ObjectId, ref: "Card", default: [] }],
  boosters: { type: [String], default: [] },
  deck: [{ type: Schema.Types.ObjectId, ref: "Card", default: [] }],
  darkMode: { type: Boolean, default: false },
});

export const UserModel = model<UserDocument>("User", userSchema);
