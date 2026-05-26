import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

import { PopulatedUserFriendsDocument } from "@database/interfaces/user.interface";

export async function findByIdWithFriends(
  userId: string
): Promise<Result<PopulatedUserFriendsDocument["friends"], string>> {
  try {
    const user = await UserModel.findById(userId)
      .populate("friends", "_id pseudo avatar")
      .lean<PopulatedUserFriendsDocument>();

    if (!user) return err("USER_NOT_FOUND");

    return ok(user.friends);
  } catch (e) {
    return err("Erreur lors de la récupération de la liste d'amis");
  }
}