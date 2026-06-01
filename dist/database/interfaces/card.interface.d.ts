import { FamilyDocument } from "../models/family.model";
import { AffinityDocument } from "../models/affinity.model";
import { SerieDocument } from "../models/serie.model";
import { CardDocument } from "../models/card.model";
export interface PopulatedCardDocument extends Omit<CardDocument, "family" | "affinity" | "serie"> {
    family: FamilyDocument;
    affinity: AffinityDocument;
    serie: {
        id_serie: SerieDocument;
        position: number;
    };
}
