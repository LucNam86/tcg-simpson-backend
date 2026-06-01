import { Document, Types } from "mongoose";
export interface BoosterEntry {
    booster: Types.ObjectId;
    number: number;
}
export interface UserDocument extends Document {
    pseudo: string;
    email: string;
    avatar: string;
    passwordHash: string;
    money: number;
    countdownEnds: Date;
    myCollection: Types.ObjectId[];
    boosters: BoosterEntry[];
    decks: Types.ObjectId[];
    friends: Types.ObjectId[];
    darkMode: boolean;
}
export declare const UserModel: import("mongoose").Model<UserDocument, {}, {}, {}, Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & UserDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, UserDocument>;
