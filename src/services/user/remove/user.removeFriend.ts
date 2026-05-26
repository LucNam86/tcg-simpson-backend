import { Result, ok, err } from "@shared/Result";
import {
  findByPseudo,
  deleteFriendById,
} from "@database/methods/user";

type RemoveFriendError = "USER_NOT_FOUND" | "DATABASE_ERROR";

export async function removeUserFriendByPseudo(
  userId: string,
  friendPseudo: string,
): Promise<Result<boolean, RemoveFriendError>> {
  const friendResult = await findByPseudo(friendPseudo);

  if (!friendResult.ok) return err("DATABASE_ERROR");
  if (!friendResult.value) return err("USER_NOT_FOUND");

  const friendId = friendResult.value._id.toString();

  const removeResult = await deleteFriendById(userId, friendId);
  if (!removeResult.ok) return err("DATABASE_ERROR");

  return ok(true);
}