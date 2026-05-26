import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";
import { Types } from "mongoose";

export async function saveBoosterToUser(
  userId: string,
  boosterId: string,
): Promise<Result<void, string>> {
  try {
    const user = await UserModel.findById(userId);
    if (!user) return err("USER_NOT_FOUND");

    const existingBooster = user.boosters.find(
      (b) => b.booster.toString() === boosterId
    );

    if (existingBooster) {
      await UserModel.updateOne(
        { _id: userId, "boosters.booster": new Types.ObjectId(boosterId) },
        { $inc: { "boosters.$.number": 1 } }
      );
    } else {
      await UserModel.updateOne(
        { _id: userId },
        { $push: { boosters: { booster: new Types.ObjectId(boosterId), number: 1 } } }
      );
    }

    return ok(undefined);
  } catch (e) {
    console.error("addBoosterToUser error:", e);
    return err("DATABASE_ERROR");
  }
}