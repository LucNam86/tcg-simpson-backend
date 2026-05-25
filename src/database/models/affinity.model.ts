import { Schema, model, Document } from "mongoose";

interface IBonus {
  ATK: number;
  PV: number;
}

export interface AffinityDocument extends Document {
  name: string;
  description: string;
  bonus: IBonus;
}

const affinitySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  bonus: {
    ATK: { type: Number, required: true, default: 0 },
    PV: { type: Number, required: true, default: 0 },
  },
});

export const AffinityModel = model<AffinityDocument>(
  "Affinity",
  affinitySchema,
);
