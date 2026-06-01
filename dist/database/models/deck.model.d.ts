import { Document, Types } from "mongoose";
export interface DeckDocument extends Document {
    name: string;
    cards: Types.ObjectId[];
    isActive: boolean;
    user: Types.ObjectId;
}
export declare const DeckModel: import("mongoose").Model<DeckDocument, {}, {}, {}, Document<unknown, {}, DeckDocument, {}, import("mongoose").DefaultSchemaOptions> & DeckDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, DeckDocument>;
