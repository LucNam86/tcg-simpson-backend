import { PopulatedCardDocument } from "@database/interfaces/card.interface";
import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export const saveCardsToCollection = async (
  userId: string,
  boosterId: string,
  cards: PopulatedCardDocument[],
): Promise<Result<void, string>> => {
  try {
    const updated = await UserModel.findOneAndUpdate(
      {
        _id: userId,
        boosters: { $elemMatch: { booster: boosterId, number: { $gt: 0 } } },
      },
      {
        $push: { myCollection: { $each: cards.map((card) => card._id.toString()) } },
        $inc: { "boosters.$[b].number": -1 },
      },
      {
        arrayFilters: [{ "b.booster": boosterId, "b.number": { $gt: 0 } }],
        new: true,
      },
    );

    if (!updated) return err("NO_BOOSTER_AVAILABLE");

    return ok(undefined);
  } catch (e) {
    console.error("saveCardsToCollection error:", e);
    return err("Erreur lors de l'ajout des cartes à la collection");
  }
};