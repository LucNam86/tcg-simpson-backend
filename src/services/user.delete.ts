// services/user.delete.ts
import { Result, ok, err } from "@shared/Result";
import { deleteById } from "@database/methods/user";

type DeleteUserError = "USER_NOT_FOUND" | "DATABASE_ERROR";

export async function deleteUser(
  userId: string,
): Promise<Result<void, DeleteUserError>> {
  const deleted = await deleteById(userId);

  if (!deleted.ok)
    return err(deleted.error === "USER_NOT_FOUND" ? deleted.error : "DATABASE_ERROR");

  return ok(undefined);
}