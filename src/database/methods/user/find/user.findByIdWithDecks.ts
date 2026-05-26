import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";
import { PopulatedUserDecksDocument } from "@database/interfaces/user.interface";

export async function findByIdWithDecks(
  userId: string,
): Promise<Result<PopulatedUserDecksDocument, string>> {
  try {
    const user = await UserModel.findById(userId)
      .populate({
        path: "decks",
        populate: {
          path: "cards",
          populate: [
            { path: "family" },
            { path: "affinity" },
            { path: "serie.id_serie" },
          ],
        },
      })
      .lean<PopulatedUserDecksDocument>();

    if (!user) return err("USER_NOT_FOUND");
    return ok(user);
  } catch (e) {
    console.error("findByIdWithDecks error:", e);
    return err("Erreur lors de la récupération des decks");
  }
}