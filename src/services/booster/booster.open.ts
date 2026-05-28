import { Result, ok, err } from "@shared/Result";
import { findByIdWithBoosters, saveCardsToCollection } from "@database/methods/user";
import { mapCard } from "@database/mapper/card.mapper";
import { PopulatedCardDocument } from "@database/interfaces/card.interface";

type OpenBoosterError =
  | "DATABASE_ERROR"
  | "USER_NOT_FOUND"
  | "NO_BOOSTER_AVAILABLE"
  | "BOOSTER_NOT_FOUND";

type MappedCard = ReturnType<typeof mapCard>;

const pickRarity = (
  probabilities: { rarity: "Common" | "Rare" | "Legendary"; value: number }[],
) => {
  const roll = Math.random() * 100;
  let cumulative = 0;

  const sortedProbabilities = [...probabilities].sort((a, b) => a.value - b.value);

  for (const probability of sortedProbabilities) {
    cumulative += probability.value;
    if (roll < cumulative) return probability.rarity;
  }

  return sortedProbabilities[sortedProbabilities.length - 1]?.rarity || "Common";
};

const pickCards = (
  cards: PopulatedCardDocument[],
  probabilities: { rarity: "Common" | "Rare" | "Legendary"; value: number }[],
  packSize: number,
): PopulatedCardDocument[] => {
  const result: PopulatedCardDocument[] = [];

  const rarityMapping: Record<"Common" | "Rare" | "Legendary", string> = {
    Common: "1",
    Rare: "2",
    Legendary: "3",
  };

  for (let i = 0; i < packSize; i++) {
    const rarityText = pickRarity(probabilities);
    const targetRarityId = rarityMapping[rarityText];
    const cardsOfRarity = cards.filter((card) => card.rarity === targetRarityId);
    const pool = cardsOfRarity.length > 0 ? cardsOfRarity : cards;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    result.push(picked);
  }

  return result;
};

export async function openBooster(
  userId: string,
  boosterId: string,
): Promise<Result<MappedCard[], OpenBoosterError>> {
  const userResult = await findByIdWithBoosters(userId);
  if (!userResult.ok) return err("DATABASE_ERROR");
  if (!userResult.value) return err("USER_NOT_FOUND");

  const userBooster = userResult.value.boosters.find(
    (ub) => ub.booster._id.toString() === boosterId,
  );
  if (!userBooster) return err("BOOSTER_NOT_FOUND");
  if (userBooster.number <= 0) return err("NO_BOOSTER_AVAILABLE");

  const rawCards = userBooster.booster.cards as PopulatedCardDocument[];
  const packSize = userBooster.booster.quantity || 5;

  const pickedRawCards = pickCards(rawCards, userBooster.booster.probabilities, packSize);

  const saveResult = await saveCardsToCollection(userId, boosterId, pickedRawCards);
  if (!saveResult.ok) return err("DATABASE_ERROR");

  console.log(`\n🎰 [BOOSTER OPENED] - ${userBooster.booster.name}`);
  console.log(`Distribution obtenue :`, pickedRawCards.map((c) => `Rareté [${c.rarity}] - ${c.name}`));

  return ok(pickedRawCards.map(mapCard));
}