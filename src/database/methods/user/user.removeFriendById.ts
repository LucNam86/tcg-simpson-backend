import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

type DbResultError = "DATABASE_ERROR";


export const removeFriendById = async (
  userId: string,
  friendId: string,
): Promise<Result<boolean, DbResultError>> => {
  try {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });

    await UserModel.findByIdAndUpdate(friendId, {
      $pull: { friends: userId },
    });

    return ok(true);
  } catch (error) {
    console.error("Erreur BDD removeFriendById:", error);
    return err("DATABASE_ERROR");
  }
};