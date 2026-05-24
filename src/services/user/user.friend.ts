import { Result, ok, err } from "@shared/Result";
import { findByPseudo, addFriendById } from "@database/methods/user";

type AddFriendError = "USER_NOT_FOUND" | "CANT_ADD_SELF" | "DATABASE_ERROR";

export const addUserFriend = async (
  userId: string,
  friendPseudo: string,
): Promise<Result<boolean, AddFriendError>> => {
  const friendResult = await findByPseudo(friendPseudo);

  if (!friendResult.ok) return err("DATABASE_ERROR");
  if (!friendResult.value) return err("USER_NOT_FOUND");

  const friend = friendResult.value;

  // 🎯 Extraction sécurisée de l'ID (gère le fait que ce soit ._id ou .id sans crash)
  const friendId = friend._id
    ? String(friend._id)
    : friend.id
      ? String(friend.id)
      : null;

  // Si on n'a pas pu récupérer d'ID pour cet ami, c'est un problème de base de données/projection
  if (!friendId) return err("DATABASE_ERROR");

  // Comparaison propre avec l'userId du token
  if (friendId === String(userId)) {
    return err("CANT_ADD_SELF");
  }

  // Ajout en BDD
  const addResult = await addFriendById(userId, friendId);
  if (!addResult.ok) return err("DATABASE_ERROR");

  return ok(true);
};
