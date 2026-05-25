import { Result, ok, err } from "@shared/Result";
import { UserModel, UserDocument } from "@database/models/user.model";
import {PublicCard} from "@shared/Schemas/card.schema";

export const save = async (user: any): Promise<Result<string, string>> => {
    console.log("SAVE USER CALLED", user);

  try {
    const doc = await UserModel.create(user);
    return ok(doc._id.toString());
  } catch (e) {
   if (e instanceof Error) {
    console.error("saveUser error:", e.message);
  } else {
    console.error("saveUser error unknown:", e);
  }
    return err("Erreur lors de la sauvegarde");
  }
};

export const saveCardsToCollection = async (
  userId: string,
  boosterId: string,
  cards: PublicCard[],
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
          $push: { myCollection: { $each: cards.map((card) => card.id) } },
          $pull: { boosters: { booster: boosterId } },
        }
      : {
          $push: { myCollection: { $each: cards.map((card) => card.id) } },
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