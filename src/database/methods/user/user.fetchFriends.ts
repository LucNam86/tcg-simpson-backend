import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export const fetchFriends = async (
  userId: string,
): Promise<Result<any, string>> => {
  try {
    const user = await UserModel.findById(userId).populate(
      "friends",
      "pseudo avatar",
    );

    if (!user) return err("USER_NOT_FOUND");

    return ok(user.friends);
  } catch (e) {
    return err("Erreur lors de la récupération de la liste d'amis");
  }
};
