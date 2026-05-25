import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";
import { BoosterModel } from "@database/models/booster.model";
import { SerieModel } from "@database/models/serie.model";




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

export const findByIdWithPopulate = async (
 id: string): Promise<Result<any, string>> => {
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
    path: "decks",
    populate: [
      { path: "family" },
      { path: "affinity" },
      { path: "serie.id_serie" },
    ]
  })
  .populate({
  path: "boosters.booster",
  populate: [
    {
      path: "cards",
      populate: [
        { path: "family" },
        { path: "affinity" },
        { path: "serie.id_serie" },
      ]
    },
    { path: "serie" }
  ]
});
    return ok(user);
  } catch (e) {
    console.error("findByIdWithPopulate error:", e);
    return err("Erreur lors de la recherche par ID avec collections et deck");
  }

};