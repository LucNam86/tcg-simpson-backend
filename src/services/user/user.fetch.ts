import { Result, ok, err } from "@shared/Result";
import {
  findByIdWithPopulate,
  findByIdWithFriends,
  findByManyPseudo,
  fetchDecks,
} from "@database/methods/user";
import { DeckDocument } from "@database/models/deck.model";
import {
  PublicUser,
  UserBoosters,
} from "@shared/Schemas/user.schema";
import {
  PublicCardArray,
} from "@shared/Schemas/card.schema";
import { mapUserBoosters, mapCard,mapUser,mapFriend } from "@database/mapper";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";
type FetchDecksError = "USER_NOT_FOUND" | "DATABASE_ERROR";

export interface PublicFriend {
  pseudo: string;
  avatar: string;
}

export const fetchUserById = async (
  id: string,
): Promise<Result<PublicUser, GetUserError>> => {
  const result = await findByIdWithPopulate(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  return ok(mapUser(result.value));
};

export const fetchUserCollection = async (
  id: string,
  filters: { q? : string , rarity?: string[]; type?: string[]; serie?: string[] },
): Promise<Result<PublicCardArray, GetUserError>> => {
  const result = await findByIdWithPopulate(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const obj = result.value.toObject({ virtuals: true });
  let collection = obj.myCollection || [];

// 2. CORRECTION DU FILTRE TEXTUEL MULTI-CHAMPS
  if (filters.q && filters.q.trim() !== "") {
    const searchLower = filters.q.toLowerCase().trim();

  collection = collection.filter((card: any) => {
      // On vérifie si la recherche match avec l'un des champs de la carte
      const matchName = card.name?.toLowerCase().includes(searchLower);
      const matchDesc = card.description?.toLowerCase().includes(searchLower);
      const matchFamily = card.family?.name?.toLowerCase().includes(searchLower);
      const matchAffinity = card.affinity?.name?.toLowerCase().includes(searchLower);
      const matchType = card.type?.toLowerCase().includes(searchLower);

      // Si l'un de ces champs contient le texte recherché, on garde la carte !
      return matchName || matchDesc || matchFamily || matchAffinity || matchType;
    });
  }

  if (filters.rarity) {
    collection = collection.filter(
      (card: any) => filters.rarity?.includes(card.rarity),
    );
  }

  if (filters.type) {
    collection = collection.filter(
      (card: any) => filters.type?.includes(card.type),
    );
  }

  if (filters.serie) {
    collection = collection.filter((card: any) => {
      return filters.serie?.includes(card.serie?.id_serie.name)
    }
    );
  }
  return ok(collection.map(mapCard));
};


export const fetchUserBoosters = async (userId: string): Promise<Result<UserBoosters, GetUserError>> => {
  const result = await findByIdWithPopulate(userId);
  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

return ok(mapUserBoosters(result.value.boosters));
};

export const fetchUserFriends = async (
  id: string,
): Promise<Result<PublicFriend[], GetUserError>> => {
  const result = await findByIdWithFriends(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  return ok(result.value.map(mapFriend));
};

export const fetchPseudosAutocomplete = async (
  query: string,
  excludeUserId: string,
): Promise<Result<PublicFriend[], GetUserError>> => {
  const result = await findByManyPseudo(query, excludeUserId);
  if (!result.ok) return err("DATABASE_ERROR");

  return ok(result.value as PublicFriend[]);
};

export const fetchUserDecks = async (
  userId: string,
): Promise<Result<DeckDocument[], FetchDecksError>> => {
  const result = await fetchDecks(userId);

  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") return err("USER_NOT_FOUND");
    return err("DATABASE_ERROR");
  }

  return ok(result.value);
};