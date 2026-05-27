// database/methods/user/user.addFriendById.ts
import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export const saveFriend = async (
  userId: string,
  friendId: string,
): Promise<Result<boolean, string>> => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true },
    );

    if (!updatedUser) return err("USER_NOT_FOUND");

    await UserModel.findByIdAndUpdate(friendId, {
      $addToSet: { friends: userId },
    });

    return ok(true);
  } catch (e) {
    return err("Erreur lors de l'ajout de l'ami en base de données");
  }
};