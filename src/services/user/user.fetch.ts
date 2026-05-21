import { Result, ok, err } from "@shared/Result";
import {
  findById,
} from "@database/methods/user";

import {PublicUserSchema, PublicUser } from "@shared/Schemas/user.schema";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";

export const fetchUserById = async (
  id: string,
): Promise<Result<PublicUser, GetUserError>> => {
  const result = await findById(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const parsed = PublicUserSchema.safeParse(result.value.toObject({ virtuals: true }));
  if (!parsed.success) return err("INVALID_USER");

  return ok(parsed.data);
};