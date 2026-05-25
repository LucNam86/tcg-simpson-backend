// database/mappers/booster.mapper.ts

import { PublicBooster } from "@shared/Schemas/booster.schema";
import { PublicCard } from "@shared/Schemas/card.schema";
import type { PopulatedBooster, PopulatedCard } from "@database/types/booster.type";

export const mapCard = (card: PopulatedCard): PublicCard => ({
  id: card._id.toString(),
  name: card.name,
  ATK: card.ATK,
  PV: card.PV,
  description: card.description,
  slug: card.slug,
  rarity: card.rarity,
  type: card.type,
  serie: {
    id_serie: {
      id: card.serie.id_serie._id.toString(),
      name: card.serie.id_serie.name,
    },
    position: card.serie.position,
  },
  family: { id: card.family._id.toString(), name: card.family.name, description: card.family.description, bonus: card.family.bonus },
  affinity: { id: card.affinity._id.toString(), name: card.affinity.name, description: card.affinity.description, bonus: card.affinity.bonus },
});

export const mapBooster = (booster: PopulatedBooster): PublicBooster => ({
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

export const mapBoostersFromFind = (boosters: PopulatedBooster[]) =>
  boosters.map((booster) => ({ booster: mapBooster(booster), number: 1 }));