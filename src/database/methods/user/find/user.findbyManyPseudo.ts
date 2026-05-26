import { Result, ok, err } from "@shared/Result";
import { UserModel, UserDocument } from "@database/models/user.model";

export async function findByManyPseudo(
  query: string,
  excludeUserId: string
): Promise<Result<Pick<UserDocument, "pseudo" | "avatar">[], string>> {
  try {
    const users = await UserModel.find({
      _id: { $ne: excludeUserId },
      pseudo: { $regex: `^${query}`, $options: "i" }
    })
    .select("pseudo avatar")
    .limit(5);

    return ok(users);
  } catch (e) {
    return err("Erreur lors de la recherche des pseudos");
  }
}