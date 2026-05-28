import { Result, ok, err } from "@shared/Result";
import { findByIdWithCollection, updateById } from "@database/methods/user";
import { updateMoneyById } from "@database/methods/user/update/user.updateMoneyById";

const RARITY_PRICES: Record<string, number> = {
  "1": 5,
  "2": 25,
  "3": 50,
};

type SellCardError =
  | "DATABASE_ERROR"
  | "USER_NOT_FOUND"
  | "INSUFFICIENT_QUANTITY"
  | "SERVER_ERROR";

interface SellResult {
  earnedDonuts: number;
  money: number;
}

export async function sellCollectionCards(
  userId: string,
  cardId: string,
  count: number
): Promise<Result<SellResult, SellCardError>> {
  const result = await findByIdWithCollection(userId);
  if (!result.ok) return err("DATABASE_ERROR");

  const userDoc = result.value;
  if (!userDoc) return err("USER_NOT_FOUND");

  let myCollection = userDoc.myCollection || [];

  const targetCard = myCollection.find(
    (card: any) => (card._id || card.id)?.toString() === cardId
  );

  if (!targetCard) return err("INSUFFICIENT_QUANTITY");

  const pricePerCard = RARITY_PRICES[targetCard.rarity] || 5;
  const earnedDonuts = pricePerCard * count;

  const currentOwnedCount = myCollection.filter(
    (card: any) => (card._id || card.id)?.toString() === cardId
  ).length;

  if (currentOwnedCount - count < 1) return err("INSUFFICIENT_QUANTITY");

  let removed = 0;
  const updatedCollection = myCollection.filter((card: any) => {
    const currentCardId = (card._id || card.id)?.toString();
    if (currentCardId === cardId && removed < count) {
      removed++;
      return false;
    }
    return true;
  });

  const collectionIds = updatedCollection.map((card: any) => card._id || card.id || card);

  const updateResult = await updateById(userId, { myCollection: collectionIds });
  if (!updateResult.ok) return err("SERVER_ERROR");

  const newMoney = (userDoc.money || 0) + earnedDonuts;
  const moneyResult = await updateMoneyById(userId, newMoney);
  if (!moneyResult.ok) return err("SERVER_ERROR");

  return ok({ earnedDonuts, money: moneyResult.value });
}