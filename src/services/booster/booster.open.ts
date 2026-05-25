// services/booster.service.ts

import { findById } from "@database/methods/user";
import { PopulatedBooster } from "@database/types/booster.type";
import { Result, ok, err } from "@shared/Result";
import { PublicCard } from "@shared/Schemas/card.schema";

type OpenBoosterError = "DATABASE_ERROR" | "USER_NOT_FOUND" | "NO_BOOSTER_AVAILABLE";

const pickRarity = (probabilities: { rarity: "Common" | "Rare" | "Legendary"; value: number }[]) => {
  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const probability of probabilities) {
    cumulative += probability.value;
    if (roll < cumulative) return probability.rarity;
  }

  return "Common"; // fallback
};

const pickCards = (cards: PublicCard[], probabilities: PopulatedBooster["probabilities"], count: number): PublicCard[] => {
  const result: PublicCard[] = [];

  for (let i = 0; i < count; i++) {
    const rarity = pickRarity(probabilities);
    const cardsOfRarity = cards.filter((card) => card.rarity === rarity);
    const fallback = cards; // si aucune carte de cette rareté

    const pool = cardsOfRarity.length > 0 ? cardsOfRarity : fallback;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    result.push(picked);
  }

  return result;
};

export const openBooster = async (userId: string): Promise<Result<PublicCard[], OpenBoosterError>> => {
  const userResult = await findById(userId);
  if (!userResult.ok) return err("DATABASE_ERROR");
  if (!userResult.value) return err("USER_NOT_FOUND");

  const userBoosters = userResult.value.boosters;
  if (userBoosters.length === 0) return err("NO_BOOSTER_AVAILABLE");

  const userBooster = userBoosters[0]; // ou logique pour choisir lequel ouvrir
  const { booster, number } = userBooster;

  if (number <= 0) return err("NO_BOOSTER_AVAILABLE");

  const cards = pickCards(booster.cards, booster.probabilities, 5);

  return ok(cards);
};