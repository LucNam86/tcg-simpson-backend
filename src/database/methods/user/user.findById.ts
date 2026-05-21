import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";


export const findById = async (
  id: string,
): Promise<Result<any, string>> => {
  try {
    const user = await UserModel.findById(id);
    return ok(user);
  } catch (e) {
    return err("Erreur lors de la recherche par ID");
  }
};

export const findByIdWithCollectionsAndDeck = async (
 id: string,
): Promise<Result<any, string>> => {
  try {
    const user = await UserModel.findById(id)
      .populate("myCollection")
      .populate("deck");
      console.log("findByIdWithCollectionsAndDeck:", JSON.stringify(user?.toObject(), null, 2));
    return ok(user);
  } catch (e) {
    console.error("findByIdWithCollectionsAndDeck error:", e);
    return err("Erreur lors de la recherche par ID avec collections et deck");
  }
};