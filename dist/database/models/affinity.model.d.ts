import { Document } from "mongoose";
export interface IBonus {
    ATK: number;
    PV: number;
}
export interface AffinityDocument extends Document {
    name: string;
    description: string;
    bonus: IBonus;
}
export declare const AffinityModel: import("mongoose").Model<AffinityDocument, {}, {}, {}, Document<unknown, {}, AffinityDocument, {}, import("mongoose").DefaultSchemaOptions> & AffinityDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, AffinityDocument>;
