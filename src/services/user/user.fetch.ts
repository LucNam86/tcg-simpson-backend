import { Result, ok, err } from "@shared/Result";
import {
  findById,
  findByIdWithPopulate,
  fetchFriends,
  searchByPseudo,
  fetchDecks,
  updateById,
} from "@database/methods/user";
import { DeckDocument } from "@database/models/deck.model";
import { UserDocument } from "@database/models/user.model";
import bcrypt from "bcrypt";
import {
  PublicUserSchema,
  PublicUser,
  UserBoosterArraySchema,
  UserBoosters,
  PublicFriendArraySchema,
  UpdateInput,
} from "@shared/Schemas/user.schema";
import {
  PublicCardArraySchema,
  PublicCardArray,
} from "@shared/Schemas/card.schema";
import { env } from "@config/env";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";
type UpdateUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";
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

  const parsed = PublicUserSchema.safeParse(
    JSON.parse(JSON.stringify(result.value.toJSON({ virtuals: true })))
  );
  if (!parsed.success) {
    console.error("PublicUserSchema.safeParse failed in fetchUserById:", parsed.error);
    return err("INVALID_USER");
  }

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

export const updateUser = async (
  id: string,
  input: UpdateInput,
): Promise<Result<PublicUser, UpdateUserError>> => {
  const updateData: Partial<UserDocument> = {};

  if (input.pseudo) updateData.pseudo = input.pseudo;
  if (input.password) {
    updateData.passwordHash = await bcrypt.hash(
      input.password,
      env.BCRYPT_SALT_ROUNDS,
    );
  }

  const result = await updateById(id, updateData);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const parsed = PublicUserSchema.safeParse(
    result.value.toObject({ virtuals: true }),
  );
  if (!parsed.success) return err("INVALID_USER");

  return ok(parsed.data);
};
