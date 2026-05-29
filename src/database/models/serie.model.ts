// serie.model.ts
import { Schema, model, Document } from "mongoose";

export interface SerieDocument extends Document {
  name: string;
  total: number;
}

const serieSchema = new Schema({
  name: { type: String, required: true },
  total: { type: Number, required: true, default: 40 },
}, { toObject: { virtuals: true }, toJSON: { virtuals: true } });

export const SerieModel = model<SerieDocument>("Serie", serieSchema);