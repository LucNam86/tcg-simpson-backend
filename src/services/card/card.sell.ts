import { Result, ok, err } from "@shared/Result";
import { findByIdWithCollection, updateById } from "@database/methods/user";

// Barème de revente par rareté (1: Commun, 2: Rare, 3: Légendaire)
const RARITY_PRICES: Record<string, number> = {
  "1": 5,   // 🍩 Commun
  "2": 25,  // 🍩 Rare
  "3": 50,  // 🍩 Légendaire
};

type SellCardError = 
  | "DATABASE_ERROR" 
  | "USER_NOT_FOUND" 
  | "INSUFFICIENT_QUANTITY" 
  | "SERVER_ERROR";

interface SellResult {
  earnedDonuts: number;
}

export async function sellCollectionCards(
  userId: string,
  cardId: string,
  count: number
): Promise<Result<SellResult, SellCardError>> {
  
  // 1. On récupère l'utilisateur et sa collection peuplée
  const result = await findByIdWithCollection(userId);
  if (!result.ok) return err("DATABASE_ERROR");
  
  const userDoc = result.value;
  if (!userDoc) return err("USER_NOT_FOUND");

  let myCollection = userDoc.myCollection || [];

  // 2. On cherche la carte pour connaître sa rareté et calculer le prix
  const targetCard = myCollection.find(
    (card: any) => (card._id || card.id)?.toString() === cardId
  );
  
  if (!targetCard) {
    return err("INSUFFICIENT_QUANTITY");
  }

  // Calcul dynamique des donuts gagnés
  const pricePerCard = RARITY_PRICES[targetCard.rarity] || 5;
  const earnedDonuts = pricePerCard * count;

  // 3. On compte combien de fois cette carte est présente au total
  const currentOwnedCount = myCollection.filter(
    (card: any) => (card._id || card.id)?.toString() === cardId
  ).length;

  if (currentOwnedCount < count) {
    return err("INSUFFICIENT_QUANTITY");
  }

  // 4. On retire exactement 'count' exemplaires du tableau
  let removed = 0;
  const updatedCollection = myCollection.filter((card: any) => {
    const currentCardId = (card._id || card.id)?.toString();
    if (currentCardId === cardId && removed < count) {
      removed++;
      return false; // Supprimé de la collection filtrée
    }
    return true; // Conservé
  });

  // 5. On extrait uniquement les IDs bruts pour la conformité BDD
  const collectionIds = updatedCollection.map((card: any) => card._id || card.id || card);

  // 6. Sauvegarde via ta méthode existante du sous-dossier user
  const updateResult = await updateById(userId, { myCollection: collectionIds });
  
  if (!updateResult.ok) {
    console.error("Erreur lors de l'updateById de la revente");
    return err("SERVER_ERROR");
  }

  // On renvoie le montant validé par le serveur
  return ok({ earnedDonuts });
}