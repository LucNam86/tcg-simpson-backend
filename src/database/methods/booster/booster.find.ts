import { Result, ok, err } from "@shared/Result";
import { BoosterModel } from "@database/models/booster.model";
import type { PopulatedBooster } from "@database/types/booster.type";


export const find = async (): Promise<Result<PopulatedBooster[], string>> => {
  try {
    const boosters = await BoosterModel.find()
      .populate({
        path: "cards",
        populate: [
          { path: "family" },
          { path: "affinity" },
          { path: "serie.id_serie" },
        ],
      })
      .populate("serie");

    return ok(boosters as unknown as PopulatedBooster[]);
  } catch (e) {
    console.error("find error:", e);
    return err("Erreur lors de la recherche de tous les boosters");
  }
};