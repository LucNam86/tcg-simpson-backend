import { Result, ok, err } from "@shared/Result";
import { BoosterModel } from "@database/models/booster.model";
import type { PopulatedBoosterDocument } from "@database/interfaces/booster.interface";


export const find = async (): Promise<Result<PopulatedBoosterDocument[], string>> => {
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

    return ok(boosters as unknown as PopulatedBoosterDocument[]);
  } catch (e) {
    console.error("find error:", e);
    return err("Erreur lors de la recherche de tous les boosters");
  }
};