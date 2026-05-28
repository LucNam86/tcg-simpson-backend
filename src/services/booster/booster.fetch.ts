import { Result, ok, err } from "@shared/Result";
import { find } from "@database/methods/booster";
import { mapBooster } from "@database/mapper/booster.mapper";

type GetBoosterError = "DATABASE_ERROR" | "UNKNOWN_BOOSTER";

export async function fetchBoosters(): Promise<Result<ReturnType<typeof mapBooster>[], GetBoosterError>> {
  const result = await find();

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("UNKNOWN_BOOSTER");

  return ok(result.value.map(mapBooster));
}