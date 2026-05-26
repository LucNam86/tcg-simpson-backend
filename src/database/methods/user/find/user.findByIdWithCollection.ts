import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";
import { PopulatedUserCollectionDocument } from "@database/interfaces/user.interface";

export async function findByIdWithCollection(
  id: string
): Promise<Result<PopulatedUserCollectionDocument, string>> {
  try {
    const user = await UserModel.findById(id)
      .populate({
        path: "myCollection",
        populate: [
          { path: "family" },
          { path: "affinity" },
          { path: "serie.id_serie" },
        ],
      })
      .lean<PopulatedUserCollectionDocument>();

    if (!user) return err("User not found");
    return ok(user);
  } catch (e) {
    return err("Erreur lors de la recherche avec collection");
  }
}