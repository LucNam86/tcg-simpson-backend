import { Result, ok, err } from "@shared/Result";
import { saveBoosterToUser } from "@database/methods/booster/booster.save";
import { updateMoneyById } from "@database/methods/user/update/user.updateMoneyById";
import { findById as findBoosterById}  from "@database/methods/booster/booster.findById";
import { findById } from "@database/methods/user";

type AddBoosterError = "USER_NOT_FOUND" | "BOOSTER_NOT_FOUND" | "NOT_ENOUGH_MONEY" | "DATABASE_ERROR";

interface AddBoosterResult {
  money: number;
}

export async function addBooster(
  userId: string,
  boosterId: string,
): Promise<Result<AddBoosterResult, AddBoosterError>> {
  const userResult = await findById(userId);
  if (!userResult.ok) return err("DATABASE_ERROR");
  if (!userResult.value) return err("USER_NOT_FOUND");

  const boosterResult = await findBoosterById(boosterId);
  if (!boosterResult.ok) return err("DATABASE_ERROR");
  if (!boosterResult.value) return err("BOOSTER_NOT_FOUND");

  if (userResult.value.money < boosterResult.value.price) return err("NOT_ENOUGH_MONEY");

  const saveResult = await saveBoosterToUser(userId, boosterId);
  if (!saveResult.ok) return err("DATABASE_ERROR");

  const newMoney = userResult.value.money - boosterResult.value.price;
  const moneyResult = await updateMoneyById(userId, newMoney);
  if (!moneyResult.ok) return err("DATABASE_ERROR");

  return ok({ money: moneyResult.value });
}