import { Result, ok, err } from "@shared/Result";
import { CardModel } from "@database/models/card.model";
import type { PopulatedCardDocument } from "@database/interfaces/card.interface";


export const findAllCards = async (): Promise<Result<PopulatedCardDocument[], string>> => {
  try {
    const cards = await CardModel.find()
    .populate("family")
    .populate("affinity")
    .populate("serie.id_serie")

    return ok(cards as unknown as PopulatedCardDocument[]);
  } catch (e) {
    console.error("find error:", e);
    return err("Erreur lors de la recherche de toutes les cartes");
  }
};