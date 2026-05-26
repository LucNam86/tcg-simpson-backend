import { Result, ok, err } from "@shared/Result";
import { findByIdWithPopulate } from "@database/methods/user";
import { UserBoosters } from "@shared/Schemas/user.schema";
import { mapUserBoosters } from "@database/mapper";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";

export async function fetchUserBoosters(
  userId: string,
): Promise<Result<UserBoosters, GetUserError>> {
  const result = await findByIdWithPopulate(userId);
  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");
  return ok(mapUserBoosters(result.value.boosters));
}
