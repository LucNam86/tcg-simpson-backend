import { Result, ok, err } from "@shared/Result";
import { UserModel, UserDocument } from "@database/models/user.model";

export async function findByPseudo(
  pseudo: string
): Promise<Result<UserDocument | null, string>> {
  try {
    const user = await UserModel.findOne({ pseudo });
    return ok(user);
  } catch (e) {
    return err("Erreur lors de la recherche par pseudo");
  }
}