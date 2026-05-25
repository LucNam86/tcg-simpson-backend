import { Result, ok, err } from "@shared/Result";
import {
  findByPseudo,
  addFriendById,
  removeFriendById,
} from "@database/methods/user";

type AddFriendError = "USER_NOT_FOUND" | "CANT_ADD_SELF" | "DATABASE_ERROR";
type RemoveFriendError = "USER_NOT_FOUND" | "DATABASE_ERROR";

export const addUserFriend = async (
  userId: string,
  friendPseudo: string,
): Promise<Result<boolean, AddFriendError>> => {
  const friendResult = await findByPseudo(friendPseudo);

  if (!friendResult.ok) return err("DATABASE_ERROR");
  if (!friendResult.value) return err("USER_NOT_FOUND");

  const friend = friendResult.value;

  const friendId = friend._id
    ? String(friend._id)
    : friend.id
      ? String(friend.id)
      : null;

  if (!friendId) return err("DATABASE_ERROR");

  if (friendId === String(userId)) {
    return err("CANT_ADD_SELF");
  }

  const addResult = await addFriendById(userId, friendId);
  if (!addResult.ok) return err("DATABASE_ERROR");

  return ok(true);
};

export const removeUserFriendByPseudo = async (
  userId: string,
  friendPseudo: string,
): Promise<Result<boolean, RemoveFriendError>> => {
  const friendResult = await findByPseudo(friendPseudo);

  if (!friendResult.ok) return err("DATABASE_ERROR");
  if (!friendResult.value) return err("USER_NOT_FOUND");

  const friend = friendResult.value;
  const friendId = friend._id
    ? String(friend._id)
    : friend.id
      ? String(friend.id)
      : null;

  if (!friendId) return err("DATABASE_ERROR");

  const removeResult = await removeFriendById(userId, friendId);
  if (!removeResult.ok) return err("DATABASE_ERROR");

  return ok(true);
};
