import { Document } from "mongoose";
export interface SerieDocument extends Document {
    name: string;
    total: number;
}
export declare const SerieModel: import("mongoose").Model<SerieDocument, {}, {}, {}, Document<unknown, {}, SerieDocument, {}, import("mongoose").DefaultSchemaOptions> & SerieDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, SerieDocument>;
