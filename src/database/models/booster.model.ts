import { Schema, model, Document, Types } from "mongoose";

export interface BoosterDocument extends Document {
    name: string;
    price: number;
    slug: string;
    quantity: number;
    cards: Types.ObjectId[];
    serie: Types.ObjectId;

}

const boosterSchema = new Schema({
    name : {type: String, required: true},
    price : {type: Number, required: true, default : 0},
    slug : {type: String, required: true},
    quantity: {type: Number, required: true},
    cards : {type: [Schema.Types.ObjectId], ref: "Cards", required: true, default: []},
    serie : {type: Schema.Types.ObjectId, ref: "Serie", required: true},

});

export const BoosterModel = model<BoosterDocument>("Booster", boosterSchema);
