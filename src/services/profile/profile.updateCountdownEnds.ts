import { Result, ok, err } from "@shared/Result";
import { updateCountdownEndsById } from "@database/methods/user/update/user.updateCountdownEnds";
import { findById } from "@database/methods/user";

type UpdateCountdownEndsError = "USER_NOT_FOUND" | "DATABASE_ERRORE";

export async function updateCountdown(
  userId: string,
  countdownEnds: Date,
): Promise<Result<Date, UpdateCountdownEndsError>> {

  const userResult = await findById(userId);
  if (!userResult.ok) return err("DATABASE_ERRORE");
  if (!userResult.value) return err("USER_NOT_FOUND");

  const result = await updateCountdownEndsById(userId, countdownEnds);
  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") return err("USER_NOT_FOUND");
    return err("DATABASE_ERRORE");
  }

  return ok(result.value);
}