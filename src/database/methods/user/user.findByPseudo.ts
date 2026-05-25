import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export const findByPseudo = async (
  pseudo: string,
): Promise<Result<any, string>> => {
  try {
    const user = await UserModel.findOne({ pseudo });
    return ok(user);
  } catch (e) {
    return err("Erreur lors de la recherche par pseudo");
  }
};
