import { Result, ok, err } from "@shared/Result";
import { findByIdWithBoosters } from "@database/methods/user";
import { mapUserBoosters } from "@database/mapper";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR";

export async function fetchUserBoosters(
  userId: string,
): Promise<Result<ReturnType<typeof mapUserBoosters>, GetUserError>> {
    const result = await findByIdWithBoosters(userId);
    if (!result.ok) return err("DATABASE_ERROR");
    if (!result.value) return err("USER_NOT_FOUND");
  return ok(mapUserBoosters(result.value.boosters));
}