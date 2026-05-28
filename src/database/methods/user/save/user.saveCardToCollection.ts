import {PopulatedCardDocument} from "@database/interfaces/card.interface";
import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";

export const saveCardsToCollection = async (
  userId: string,
  boosterId: string,
  cards: PopulatedCardDocument[],
): Promise<Result<void, string>> => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) return err("USER_NOT_FOUND");

    const userBooster = user.boosters.find(
      (b) => b.booster.toString() === boosterId
    );
    if (!userBooster) return err("BOOSTER_NOT_FOUND");

    const update = userBooster.number === 1
      ? {
          $push: { myCollection: { $each: cards.map((card) => card._id.toString()) } },
          $pull: { boosters: { booster: boosterId } },
        }
      : {
          $push: { myCollection: { $each: cards.map((card) => card._id.toString()) } },
          $inc: { "boosters.$[booster].number": -1 },
        };

    const options = userBooster.number === 1
      ? {}
      : { arrayFilters: [{ "booster.booster": boosterId }] };

    await UserModel.findByIdAndUpdate(userId, update, options);

    return ok(undefined);
  } catch (e) {
    console.error("saveCardsToCollection error:", e);
    return err("Erreur lors de l'ajout des cartes à la collection");
  }
};