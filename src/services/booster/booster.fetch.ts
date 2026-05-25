import { Result, ok, err } from "@shared/Result";
import {findById, find} from "@database/methods/booster";
import {PublicBoosterSchema,PublicBoosterArray,PublicBooster } from "@shared/Schemas/booster.schema";
import { mapBooster } from "@database/mapper/booster.mapper";

type GetBoosterError = "DATABASE_ERROR" | "UNKNOWN_BOOSTER" | "INVALID_BOOSTER";

export const fetchBoosterById = async (
  id: string,
): Promise<Result<PublicBooster, GetBoosterError>> => {
  const result = await findById(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("UNKNOWN_BOOSTER");

  const parsed = PublicBoosterSchema.safeParse(result.value.toObject({ virtuals: true }));
  if (!parsed.success) return err("INVALID_BOOSTER");

  return ok(parsed.data);
};

export const fetchBoosters = async (): Promise<Result<PublicBoosterArray, GetBoosterError>> => {
  const result = await find();

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("UNKNOWN_BOOSTER");

  return ok(result.value.map(mapBooster));
};