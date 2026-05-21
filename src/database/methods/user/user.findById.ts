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
  .populate({
    path: "myCollection",
    populate: [
      { path: "family" },
      { path: "affinity" },
      { path: "serie.id_serie" },
    ]
  })
  .populate({
    path: "deck",
    populate: [
      { path: "family" },
      { path: "affinity" },
      { path: "serie.id_serie" },
    ]
  });
    return ok(user);
  } catch (e) {
    console.error("findByIdWithCollectionsAndDeck error:", e);
    return err("Erreur lors de la recherche par ID avec collections et deck");
  }
};