import { Result, ok, err } from "@shared/Result";
import { findById } from "@database/methods/user";
import { updateMoneyById } from "@database/methods/user/update/user.updateMoneyById";
import { updateById } from "@database/methods/user";

const DAILY_AMOUNT = 100;
const COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 heures

type ClaimDailyError = "USER_NOT_FOUND" | "NOT_READY" | "DATABASE_ERROR";

interface ClaimDailyResult {
  money: number;
  countdownEnds: string;
}

export async function updateDailyMoney(
  userId: string,
): Promise<Result<ClaimDailyResult, ClaimDailyError>> {
  const userResult = await findById(userId);
  if (!userResult.ok) return err("DATABASE_ERROR");
  if (!userResult.value) return err("USER_NOT_FOUND");

  const user = userResult.value;

  // Vérification que le cooldown est terminé
  if (user.countdownEnds) {
    const countdownEnd = new Date(user.countdownEnds).getTime();
    const now = new Date().getTime();
    if (now < countdownEnd) return err("NOT_READY");
  }

  const newMoney = (user.money || 0) + DAILY_AMOUNT;
  const countdownEnds = new Date(Date.now() + COOLDOWN_MS).toISOString();

  const moneyResult = await updateMoneyById(userId, newMoney);
  if (!moneyResult.ok) return err("DATABASE_ERROR");

  const updateResult = await updateById(userId, { countdownEnds: new Date(countdownEnds) });
  if (!updateResult.ok) return err("DATABASE_ERROR");

  return ok({ money: newMoney, countdownEnds });
}