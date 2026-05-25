import { Result, ok, err } from "@shared/Result";
import {
  findById,
  findByIdWithPopulate,
  fetchFriends,
  searchByPseudo,
} from "@database/methods/user";

import {
  PublicUserSchema,
  PublicUser,
  UserBoosterArraySchema,
  UserBoosters,
  PublicFriendArraySchema,
} from "@shared/Schemas/user.schema";
import {
  PublicCardArraySchema,
  PublicCardArray,
} from "@shared/Schemas/card.schema";
import { SerieModel } from "@database/models/serie.model";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";

export interface PublicFriend {
  pseudo: string;
  avatar: string;
}

export const fetchUserById = async (
  id: string,
): Promise<Result<PublicUser, GetUserError>> => {
  const result = await findById(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const parsed = PublicUserSchema.safeParse(
    result.value.toObject({ virtuals: true }),
  );
  if (!parsed.success) return err("INVALID_USER");

  return ok(parsed.data);
};

export const fetchUserCollection = async (
  id: string,
  filters: { rarity?: string[]; type?: string[]; serie?: string[] },
): Promise<Result<PublicCardArray, GetUserError>> => {
  const result = await findByIdWithPopulate(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const obj = result.value.toObject({ virtuals: true });
  let collection = obj.myCollection || [];

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

  const parsed = PublicCardArraySchema.safeParse(collection);
  if (!parsed.success) return err("INVALID_USER");

  return ok(parsed.data);
};

export const fetchUserBoosters = async (
  id: string,
): Promise<Result<UserBoosters, GetUserError>> => {
  console.log("fetchUserBoosters called with id:", id);

  const result = await findByIdWithPopulate(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const obj = result.value.toObject({ virtuals: true });

  const parsed = UserBoosterArraySchema.safeParse(obj.boosters);
  if (!parsed.success) return err("INVALID_USER");

  return ok(parsed.data);
};

export const fetchUserFriends = async (
  id: string,
): Promise<Result<PublicFriend[], GetUserError>> => {
  const result = await fetchFriends(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const parsed = PublicFriendArraySchema.safeParse(result.value);
  if (!parsed.success) return err("INVALID_USER");

  return ok(parsed.data);
};
export const fetchPseudosAutocomplete = async (
  query: string,
  excludeUserId: string,
): Promise<Result<PublicFriend[], GetUserError>> => {
  const result = await searchByPseudo(query, excludeUserId);
  if (!result.ok) return err("DATABASE_ERROR");

  return ok(result.value as PublicFriend[]);
};
