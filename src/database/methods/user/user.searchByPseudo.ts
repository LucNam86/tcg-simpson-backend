import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export const searchByPseudo = async (
  query: string,
  excludeUserId: string
): Promise<Result<any[], string>> => {
  try {
    // 🎯 Recherche avec Regex : '^' signifie "commence par"
    // 'i' permet d'ignorer les majuscules/minuscules
    const users = await UserModel.find({
      _id: { $ne: excludeUserId }, // On s'exclut soi-même des résultats
      pseudo: { $regex: `^${query}`, $options: "i" }
    })
    .select("pseudo avatar")
    .limit(5); // On limite à 5 propositions pour garder ça propre

    return ok(users);
  } catch (e) {
    return err("Erreur lors de la recherche des pseudos");
  }
};