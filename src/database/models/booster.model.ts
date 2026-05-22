import { Schema, model, Document, Types } from "mongoose";

export interface BoosterDocument extends Document {
    name: string;
    price: number;
    slug: string;
    quantity: number;
    cards: Types.ObjectId[];
    serie: Types.ObjectId;
    probabilities: {
        rarity: "Common" | "Rare" | "Legendary";
        value: number;
    }[];
}

const boosterSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    slug: { type: String, required: true },
    quantity: { type: Number, required: true },
    cards: { type: [Schema.Types.ObjectId], ref: "Card", required: true, default: [] },
    serie: { type: Schema.Types.ObjectId, ref: "Serie", required: true },
    probabilities: {
        type: [{
            rarity: { type: String, enum: ["Common", "Rare", "Legendary"], required: true },
            value: { type: Number, required: true },
        }],
        required: true,
        default: [
            { rarity: "Common", value: 70 },
            { rarity: "Rare", value: 25 },
            { rarity: "Legendary", value: 5 },
        ],
    },
});

export const BoosterModel = model<BoosterDocument>("Booster", boosterSchema);
