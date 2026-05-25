// services/booster.open.ts
import { Result, ok, err } from "@shared/Result";
import { findByIdWithPopulate,saveCardsToCollection } from "@database/methods/user";
import type { PublicCard } from "@shared/Schemas/card.schema";
import type { UserBoosters } from "@shared/Schemas/user.schema";
import { mapCard } from "@database/mapper/booster.mapper";


type OpenBoosterError = "DATABASE_ERROR" | "USER_NOT_FOUND" | "NO_BOOSTER_AVAILABLE" | "BOOSTER_NOT_FOUND";

const pickRarity = (probabilities: { rarity: "Common" | "Rare" | "Legendary"; value: number }[]) => {
  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const probability of probabilities) {
    cumulative += probability.value;
    if (roll < cumulative) return probability.rarity;
  }

  return "Common";
};

const pickCards = (cards: PublicCard[], probabilities: { rarity: "Common" | "Rare" | "Legendary"; value: number }[]): PublicCard[] => {
  const result: PublicCard[] = [];

  for (let i = 0; i < 5; i++) {
    const rarity = pickRarity(probabilities);
    const cardsOfRarity = cards.filter((card) => card.rarity === rarity);
    const pool = cardsOfRarity.length > 0 ? cardsOfRarity : cards;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    result.push(picked);
  }

  return result;
};

// services/booster.open.ts
export const openBooster = async (userId: string, boosterId: string): Promise<Result<PublicCard[], OpenBoosterError>> => {
  const userResult = await findByIdWithPopulate(userId);
  if (!userResult.ok) return err("DATABASE_ERROR");
  if (!userResult.value) return err("USER_NOT_FOUND");

  const userBooster = userResult.value.boosters.find(
    (userBooster: UserBoosters[number]) => userBooster.booster.id === boosterId
  );
  if (!userBooster) return err("BOOSTER_NOT_FOUND");
  if (userBooster.number <= 0) return err("NO_BOOSTER_AVAILABLE");

const rawCards = userBooster.booster.cards as any[];
const mappedCards = rawCards.map(mapCard);
const cards = pickCards(mappedCards, userBooster.booster.probabilities);

  // 👇 Sauvegarder les cartes dans myCollection et décrémenter le booster
  const saveResult = await saveCardsToCollection(userId, boosterId, cards);
  if (!saveResult.ok) return err("DATABASE_ERROR");

  return ok(cards);
};