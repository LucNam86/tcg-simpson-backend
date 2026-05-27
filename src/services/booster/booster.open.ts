// services/booster.open.ts
import { Result, ok, err } from "@shared/Result";
import {
  findByIdWithBoosters,
  saveCardsToCollection,
} from "@database/methods/user";
import type { PublicCard } from "@shared/Schemas/card.schema";
import { mapCard } from "@database/mapper/card.mapper";
import { PopulatedCardDocument } from "@database/interfaces/card.interface";

type OpenBoosterError =
  | "DATABASE_ERROR"
  | "USER_NOT_FOUND"
  | "NO_BOOSTER_AVAILABLE"
  | "BOOSTER_NOT_FOUND";

const pickRarity = (
  probabilities: { rarity: "Common" | "Rare" | "Legendary"; value: number }[],
) => {
  const roll = Math.random() * 100;
  let cumulative = 0;

  const sortedProbabilities = [...probabilities].sort(
    (a, b) => b.value - a.value,
  );

  for (const probability of sortedProbabilities) {
    cumulative += probability.value;
    if (roll < cumulative) return probability.rarity;
  }

  return sortedProbabilities[0]?.rarity || "Common";
};

const pickCards = (
  cards: PublicCard[],
  probabilities: { rarity: "Common" | "Rare" | "Legendary"; value: number }[],
  packSize: number,
): PublicCard[] => {
  const result: PublicCard[] = [];

  for (let i = 0; i < packSize; i++) {
    const rarity = pickRarity(probabilities);
    const cardsOfRarity = cards.filter((card) => card.rarity === rarity);
    const pool = cardsOfRarity.length > 0 ? cardsOfRarity : cards;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    result.push(picked);
  }

  return result;
};

export const openBooster = async (
  userId: string,
  boosterId: string,
): Promise<Result<PublicCard[], OpenBoosterError>> => {
  const userResult = await findByIdWithBoosters(userId);
  if (!userResult.ok) return err("DATABASE_ERROR");
  if (!userResult.value) return err("USER_NOT_FOUND");

  const userBooster = userResult.value.boosters.find(
    (ub: { booster: { _id: { toString: () => string } } }) =>
      ub.booster._id.toString() === boosterId,
  );
  if (!userBooster) return err("BOOSTER_NOT_FOUND");
  if (userBooster.number <= 0) return err("NO_BOOSTER_AVAILABLE");

  const rawCards = userBooster.booster.cards as PopulatedCardDocument[];
  const mappedCards = rawCards.map(mapCard);

  const packSize = userBooster.booster.quantity || 5;

  const cards = pickCards(
    mappedCards,
    userBooster.booster.probabilities,
    packSize,
  );

  const saveResult = await saveCardsToCollection(userId, boosterId, cards);
  if (!saveResult.ok) return err("DATABASE_ERROR");

  return ok(cards);
};
