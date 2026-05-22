import { Result, ok, err } from "@shared/Result";
import { BoosterModel } from "@database/models/booster.model";
import { HydratedDocument } from "mongoose";
import { BoosterDocument } from "@database/models/booster.model";

export const find= async (): Promise<Result<HydratedDocument<BoosterDocument>[], string>> => {
  try {
    const boosters = await BoosterModel.find()
  .populate({
    path: "cards",
    populate: [
      { path: "family" },
      { path: "affinity" },
      { path: "serie.id_serie" },
    ]
  })
  .populate("serie");
    return ok(boosters);
  } catch (e) {
    console.error("find error:", e);
    return err("Erreur lors de la recherche de tous les boosters avec collections");
  }
};