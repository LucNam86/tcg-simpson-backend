import { PopulatedBoosterDocument } from "@database/interfaces/booster.interface";
import { mapCard } from "@database/mapper/card.mapper";

export const mapBooster = (booster: PopulatedBoosterDocument) => ({
  id: booster._id.toString(),
  name: booster.name,
  price: booster.price,
  slug: booster.slug,
  quantity: booster.quantity,
  cards: booster.cards.map(mapCard),
  serie: { id: booster.serie._id.toString(), name: booster.serie.name },
  probabilities: booster.probabilities.map((probability) => ({
    rarity: probability.rarity,
    value: probability.value,
  })),
});

export const mapUserBoosters = (boosters: any[]) =>
  boosters.map((entry) => ({ booster: mapBooster(entry.booster), number: entry.number }));

export const mapBoostersFromFind = (boosters: PopulatedBoosterDocument[]) =>
  boosters.map((booster) => ({ booster: mapBooster(booster), number: 1 }));