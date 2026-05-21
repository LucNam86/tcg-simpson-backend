import { Schema, model, Document, Types } from "mongoose";

export interface CardDocument extends Document {
  name: string;
  ATK: number;
  PV: number;
  family: Types.ObjectId;
  affinity: Types.ObjectId;
  slug: string;
  serie: {
    id_serie: Types.ObjectId;
    position: number;
  };
  rarity: string;
  type: "Personnage" | "Objet" | "Terrain";
}

const cardSchema = new Schema({
  name: { type: String, required: true },
  ATK: { type: Number, required: true },
  PV: { type: Number, required: true },
  family: { type: Schema.Types.ObjectId, ref: "Family", required: true },
  affinity: { type: Schema.Types.ObjectId, ref: "Affinity", required: true },
  slug: { type: String, required: true, unique: true },
  serie: {
    id_serie: { type: Schema.Types.ObjectId, ref: "Serie", required: true },
    position: { type: Number, required: true },
  },
  rarity: { type: String, required: true },
  type: {
    type: String,
    enum: ["Personnage", "Objet", "Terrain"],
    required: true,
  },
});

export const CardModel = model<CardDocument>("Card", cardSchema);
