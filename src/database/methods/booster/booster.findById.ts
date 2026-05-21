import { Result, ok, err } from "@shared/Result";
import { BoosterModel } from "@database/models/booster.model";


export const findById = async (
  id: string,
): Promise<Result<any, string>> => {
  try {
    const booster = await BoosterModel.findById(id);
    return ok(booster);
  } catch (e) {
    return err("Erreur lors de la recherche par ID");
  }
};
