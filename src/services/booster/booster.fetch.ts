import { Result, ok, err } from "@shared/Result";
import {findById} from "@database/methods/booster/booster.findById";
import {PublicBoosterSchema } from "@shared/Schemas/booster.schema";



type GetBoosterError = "DATABASE_ERROR" | "UNKNOWN_BOOSTER" | "INVALID_BOOSTER";

export const fetchBoosterById = async (
  id: string,
): Promise<Result<PublicBoosterSchema, GetBoosterError>> => {
  const result = await findById(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("UNKNOWN_BOOSTER");

  const parsed = PublicBoosterSchema.safeParse(result.value.toObject({ virtuals: true }));
  if (!parsed.success) return err("INVALID_BOOSTER");

  return ok(parsed.data);
};