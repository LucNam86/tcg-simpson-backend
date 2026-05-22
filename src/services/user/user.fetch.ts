import { Result, ok, err } from "@shared/Result";
import {
  findById,findByIdWithPopulate
} from "@database/methods/user";

import {PublicUserSchema, PublicUser } from "@shared/Schemas/user.schema";
import {PublicCardArraySchema, PublicCardArray } from "@shared/Schemas/card.schema";
import {PublicBoosterArraySchema, PublicBoosterArray } from "@shared/Schemas/booster.schema";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";

export const fetchUserById = async (
  id: string,
): Promise<Result<PublicUser, GetUserError>> => {
  const result = await findById(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const parsed = PublicUserSchema.safeParse(result.value.toObject({ virtuals: true }));
  if (!parsed.success) return err("INVALID_USER");

  return ok(parsed.data);
};


export const fetchUserCollection = async (
  id: string,
): Promise<Result<PublicCardArray, GetUserError>> => {
  const result = await findByIdWithPopulate(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const obj = result.value.toObject({ virtuals: true });
  
  const parsed = PublicCardArraySchema.safeParse(obj.myCollection);
  if (!parsed.success) return err("INVALID_USER");

  return ok(parsed.data);
};


export const fetchUserBoosters = async (
  id: string,
): Promise<Result<PublicBoosterArray, GetUserError>> => {
  const result = await findByIdWithPopulate(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const obj = result.value.toObject({ virtuals: true });
  console.log("boosters:", JSON.stringify(obj.boosters, null, 2));
  const parsed = PublicBoosterArraySchema.safeParse(obj.boosters);
  if (!parsed.success) return err("INVALID_USER");

  return ok(parsed.data);
};