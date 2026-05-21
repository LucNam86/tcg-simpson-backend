import { Schema, model, Document } from "mongoose";

interface IBonus {
  ATK: number;
  PV: number;
}

export interface FamilyDocument extends Document {
  name: string;
  desc: string;
  bonus: IBonus;
}

const familySchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  bonus: {
    ATK: { type: Number, required: true, default: 0 },
    PV: { type: Number, required: true, default: 0 },
  },
});

export const FamilyModel = model<FamilyDocument>("Family", familySchema);
