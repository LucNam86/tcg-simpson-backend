import { Result, ok, err } from "@shared/Result";
import { findByIdWithCollection } from "@database/methods/user";
import { mapUser } from "@database/mapper";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR";

export async function fetchUserById(
  id: string,
): Promise<Result<ReturnType<typeof mapUser>, GetUserError>> {
  const result = await findByIdWithCollection(id);
  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");
  return ok(mapUser(result.value));
}