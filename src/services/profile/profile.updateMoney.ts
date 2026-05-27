import { Result, ok, err } from "@shared/Result";
import { updateMoneyById } from "@database/methods/user";
import { findById } from "@database/methods/user";

type UpdateMoneyError = "USER_NOT_FOUND" | "INVALID_AMOUNT" | "DATABASE_ERROR";

export async function updateMoney(
  userId: string,
  amount: number,
): Promise<Result<number, UpdateMoneyError>> {
  if (amount < 0) return err("INVALID_AMOUNT");

  const userResult = await findById(userId);
  if (!userResult.ok) return err("DATABASE_ERROR");
  if (!userResult.value) return err("USER_NOT_FOUND");

  const result = await updateMoneyById(userId, amount);
  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") return err("USER_NOT_FOUND");
    return err("DATABASE_ERROR");
  }

  return ok(result.value);
}