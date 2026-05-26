import { UserModel } from "@database/models/user.model";
import { Result, ok, err } from "@shared/Result";
import { PopulatedUserBoostersDocument } from "@database/interfaces/user.interface";

export async function findByIdWithBoosters(
  id: string
): Promise<Result<PopulatedUserBoostersDocument, string>> {
  try {
    const user = await UserModel.findById(id)
      .populate({
        path: "boosters.booster",
        populate: [
          {
            path: "cards",
            populate: [
              { path: "family" },
              { path: "affinity" },
              { path: "serie.id_serie" },
            ],
          },
          { path: "serie" },
        ],
      })
      .lean<PopulatedUserBoostersDocument>();

    if (!user) return err("User not found");
    return ok(user);
  } catch (e) {
    return err("Erreur lors de la recherche avec boosters");
  }
}
