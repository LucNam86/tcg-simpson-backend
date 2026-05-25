import { Result, ok, err } from "@shared/Result";
import { updateById, findByIdWithPopulate } from "@database/methods/user";
import { UserDocument } from "@database/models/user.model";
import bcrypt from "bcrypt";
import {
  UpdateInput,
  PublicUser,
  PublicUserSchema,
} from "@shared/Schemas/user.schema";
import { env } from "@config/env";

type UpdateUserError =
  | "USER_NOT_FOUND"
  | "DATABASE_ERROR"
  | "INVALID_USER"
  | "PSEUDO_ALREADY_USED";

export const updateUser = async (
  id: string,
  input: UpdateInput & { money?: number },
): Promise<Result<PublicUser, UpdateUserError>> => {
  const updateData: Partial<UserDocument> = {};

  if (input.pseudo) updateData.pseudo = input.pseudo;
  if (input.password) {
    updateData.passwordHash = await bcrypt.hash(
      input.password,
      env.BCRYPT_SALT_ROUNDS,
    );
  }

  if (input.money !== undefined) {
    updateData.money = input.money;
  }

  const result = await updateById(id, updateData);

  if (!result.ok) {
    if (result.error === "PSEUDO_ALREADY_USED")
      return err("PSEUDO_ALREADY_USED");
    return err("DATABASE_ERROR");
  }

  if (!result.value) return err("USER_NOT_FOUND");

  const populatedResult = await findByIdWithPopulate(id);
  if (!populatedResult.ok) return err("DATABASE_ERROR");
  if (!populatedResult.value) return err("USER_NOT_FOUND");

  const parsed = PublicUserSchema.safeParse(
    JSON.parse(
      JSON.stringify(populatedResult.value.toJSON({ virtuals: true })),
    ),
  );
  if (!parsed.success) {
    console.error(
      "PublicUserSchema.safeParse failed in updateUser:",
      parsed.error,
    );
    return err("INVALID_USER");
  }

  return ok(parsed.data);
};
