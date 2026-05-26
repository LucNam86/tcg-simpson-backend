import { Result, ok, err } from "@shared/Result";
import { findByIdWithPopulate } from "@database/methods/user";
import { PublicUser } from "@shared/Schemas/user.schema";
import { mapUser } from "@database/mapper";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";

export async function fetchUserById(
  id: string,
): Promise<Result<PublicUser, GetUserError>> {
  const result = await findByIdWithPopulate(id);
  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");
  return ok(mapUser(result.value));
}
