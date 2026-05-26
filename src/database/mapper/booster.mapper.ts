// database/mappers/booster.mapper.ts

import { PublicBooster } from "@shared/Schemas/booster.schema";
import { PopulatedBoosterDocument } from "@database/interfaces/booster.interface";
import { mapCard } from "@database/mapper/card.mapper";

export const mapBooster = (booster: PopulatedBoosterDocument): PublicBooster => ({
  id: booster._id.toString(),
  name: booster.name,
  price: booster.price,
  slug: booster.slug,
  quantity: booster.quantity,
  cards: booster.cards.map(mapCard),
  serie: { id: booster.serie._id.toString(), name: booster.serie.name },
  probabilities: booster.probabilities.map((probability) => ({
    id: (probability as any)._id.toString(),
    rarity: probability.rarity,
    value: probability.value,
  })),
});

export const mapUserBoosters = (boosters: any[]) =>
  boosters.map((entry) => ({ booster: mapBooster(entry.booster), number: entry.number }));

export const mapBoostersFromFind = (boosters: PopulatedBoosterDocument[]) =>
  boosters.map((booster) => ({ booster: mapBooster(booster), number: 1 }));