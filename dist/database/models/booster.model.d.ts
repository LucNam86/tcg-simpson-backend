import { Document, Types } from "mongoose";
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
export declare const BoosterModel: import("mongoose").Model<BoosterDocument, {}, {}, {}, Document<unknown, {}, BoosterDocument, {}, import("mongoose").DefaultSchemaOptions> & BoosterDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, BoosterDocument>;
