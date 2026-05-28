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
    (a, b) => a.value - b.value,
  );

  for (const probability of sortedProbabilities) {
    cumulative += probability.value;
    if (roll < cumulative) {
      return probability.rarity;
    }
  }

  return (
    sortedProbabilities[sortedProbabilities.length - 1]?.rarity || "Common"
  );
};

const pickCards = (
  cards: PublicCard[],
  probabilities: { rarity: "Common" | "Rare" | "Legendary"; value: number }[],
  packSize: number,
): PublicCard[] => {
  const result: PublicCard[] = [];

  // Dictionnaire de correspondance entre ton système de probabilités et tes IDs de cartes
  const rarityMapping: Record<"Common" | "Rare" | "Legendary", string> = {
    Common: "1",
    Rare: "2",
    Legendary: "3",
  };

  for (let i = 0; i < packSize; i++) {
    const rarityText = pickRarity(probabilities);

    // 🌟 FIX : On récupère l'ID correspondant ("1", "2" ou "3")
    const targetRarityId = rarityMapping[rarityText];

    // On filtre désormais sur l'ID de rareté de la carte
    const cardsOfRarity = cards.filter(
      (card) => card.rarity === targetRarityId,
    );

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
  console.log(`\n🎰 [BOOSTER OPENED] - ${userBooster.booster.name}`);
  console.log(
    `Distribution obtenue :`,
    cards.map((c) => `Rareté [${c.rarity}] - ${c.name}`),
  );
  if (!saveResult.ok) return err("DATABASE_ERROR");

  return ok(cards);
};
/*
// 🧪 CONFIGURATION DU CRASH-TEST (À ENLEVER APRÈS VÉRIFICATION)
if (process.env.NODE_ENV !== "production") {
  const simulerTestProbabilites = () => {
    const probasBooster1 = [
      { rarity: "Common" as const, value: 70 },
      { rarity: "Rare" as const, value: 25 },
      { rarity: "Legendary" as const, value: 5 }
    ];

    const compteurs = { Common: 0, Rare: 0, Legendary: 0 };
    const totalTirages = 50000; // 10 000 boosters de 5 cartes = 50 000 tirages

    for (let i = 0; i < totalTirages; i++) {
      const rareteTiree = pickRarity(probasBooster1);
      compteurs[rareteTiree]++;
    }

    console.log("\n=============================================");
    console.log("📊 RÉSULTAT DU CRASH-TEST (50 000 CARTES TIRÉES) :");
    console.log(`🟢 Communes (70% attendus) : ${((compteurs.Common / totalTirages) * 100).toFixed(2)}% (${compteurs.Common})`);
    console.log(`🔵 Rares (25% attendus)    : ${((compteurs.Rare / totalTirages) * 100).toFixed(2)}% (${compteurs.Rare})`);
    console.log(`🟡 Légendaires (5% attendu) : ${((compteurs.Legendary / totalTirages) * 100).toFixed(2)}% (${compteurs.Legendary})`);
    console.log("=============================================\n");
  };

  // Lance la simulation dès que le fichier est chargé par ton serveur Node
  simulerTestProbabilites();
}*/