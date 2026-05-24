import { Result, ok, err } from "@shared/Result";
import { findByPseudo, addFriendById } from "@database/methods/user";

type AddFriendError = "USER_NOT_FOUND" | "CANT_ADD_SELF" | "DATABASE_ERROR";

export const addUserFriend = async (
  userId: string,
  friendPseudo: string
): Promise<Result<boolean, AddFriendError>> => {

  const friendResult = await findByPseudo(friendPseudo);
  
  if (!friendResult.ok) return err("DATABASE_ERROR");
  if (!friendResult.value) return err("USER_NOT_FOUND");

  const friend = friendResult.value;

  if (friend._id.toString() === userId) {
    return err("CANT_ADD_SELF");
  }

  const addResult = await addFriendById(userId, friend._id.toString());
  if (!addResult.ok) return err("DATABASE_ERROR");

  return ok(true);
};