// database/types/booster.types.ts
import { BoosterDocument } from "@database/models/booster.model";
import { PopulatedCardDocument } from "@database/interfaces/card.interface";
import { PopulatedSerieDocument } from "@database/interfaces/serie.interface";


export interface PopulatedBoosterDocument extends Omit<BoosterDocument, "cards" | "serie"> {
  cards: PopulatedCardDocument[];
  serie: PopulatedSerieDocument;
}
