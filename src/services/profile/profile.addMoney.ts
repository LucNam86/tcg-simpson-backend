import { Result, ok, err } from "@shared/Result";
import { updateMoneyById } from "@database/methods/user";
import { findById } from "@database/methods/user";


export async function addMoney(
  userId: string,
  amount: number,
): Promise<Result<number, "USER_NOT_FOUND" | "DATABASE_ERROR">> {
  const userResult = await findById(userId);
  if (!userResult.ok) return err("DATABASE_ERROR");
  if (!userResult.value) return err("USER_NOT_FOUND");

  const newMoney = (userResult.value.money || 0) + amount;
  const result = await updateMoneyById(userId, newMoney);
  if (!result.ok) return err("DATABASE_ERROR");

  return ok(result.value);
}