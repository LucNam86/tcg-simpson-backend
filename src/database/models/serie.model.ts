import { Schema, model, Document } from "mongoose";

export interface SerieDocument extends Document {
  name: string;
}

const serieSchema = new Schema({
  name: { type: String, required: true },
});

export const SerieModel = model<SerieDocument>("Serie", serieSchema);
