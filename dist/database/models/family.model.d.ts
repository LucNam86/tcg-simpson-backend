import { Document } from "mongoose";
export interface IBonus {
    ATK: number;
    PV: number;
}
export interface FamilyDocument extends Document {
    name: string;
    description: string;
    bonus: IBonus;
}
export declare const FamilyModel: import("mongoose").Model<FamilyDocument, {}, {}, {}, Document<unknown, {}, FamilyDocument, {}, import("mongoose").DefaultSchemaOptions> & FamilyDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, FamilyDocument>;
