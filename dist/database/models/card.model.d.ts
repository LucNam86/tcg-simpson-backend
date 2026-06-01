import { Document, Types } from "mongoose";
export interface CardDocument extends Document {
    name: string;
    ATK: number;
    PV: number;
    description: string;
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
export declare const CardModel: import("mongoose").Model<CardDocument, {}, {}, {}, Document<unknown, {}, CardDocument, {}, import("mongoose").DefaultSchemaOptions> & CardDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, CardDocument>;
