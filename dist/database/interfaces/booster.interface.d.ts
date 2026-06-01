import { BoosterDocument } from "../models/booster.model";
import { PopulatedCardDocument } from "../interfaces/card.interface";
import { PopulatedSerieDocument } from "../interfaces/serie.interface";
export interface PopulatedBoosterDocument extends Omit<BoosterDocument, "cards" | "serie"> {
    cards: PopulatedCardDocument[];
    serie: PopulatedSerieDocument;
}
