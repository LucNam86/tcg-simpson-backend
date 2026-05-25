// database/types/booster.types.ts
import { Types } from "mongoose";
import { CardDocument } from "@database/models/card.model";
import { BoosterDocument } from "@database/models/booster.model";

export type PopulatedSerie = { _id: Types.ObjectId; name: string };
export type PopulatedFamily = { 
  _id: Types.ObjectId; 
  name: string; 
  desc: string;
  description: string;
  bonus: { ATK: number; PV: number } 
};
;

export type PopulatedAffinity = { 
  _id: Types.ObjectId; 
  name: string; 
  desc: string;
  description: string;
  bonus: { ATK: number; PV: number } 
};

export type PopulatedCard = Omit<CardDocument, "serie" | "family" | "affinity"> & {
  _id: Types.ObjectId;
  description: string;
  family: PopulatedFamily;
  affinity: PopulatedAffinity;
  serie: {
    id_serie: PopulatedSerie;
    position: number;
  };
};

export type PopulatedBooster = Omit<BoosterDocument, "serie" | "cards"> & {
  _id: Types.ObjectId;
  serie: PopulatedSerie;
  cards: PopulatedCard[];
};