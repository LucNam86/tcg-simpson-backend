import { FamilyDocument } from "@database/models/family.model";
import { AffinityDocument } from "@database/models/affinity.model";
import { SerieDocument } from "@database/models/serie.model";
import { CardDocument } from "@database/models/card.model";

export interface PopulatedCardDocument extends Omit<CardDocument, "family" | "affinity" | "serie"> {
  description: string;
  family: FamilyDocument;
  affinity: AffinityDocument;
  serie: {
    id_serie: SerieDocument;
    position: number;
  };
}