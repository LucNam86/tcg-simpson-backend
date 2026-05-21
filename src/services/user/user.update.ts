import { Result, ok, err } from "@shared/Result";
import { updateById } from "@database/methods/user";
import { UserDocument } from "@database/models/user.model";
import bcrypt from "bcrypt";
import { UpdateInput, PublicUser, PublicUserSchema } from "@shared/Schemas/user.schema";
import { env } from "@config/env";

type UpdateUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";

export const updateUser = async (
  id: string,
  input: UpdateInput,
): Promise<Result<PublicUser, UpdateUserError>> => {
  const updateData: Partial<UserDocument> = {};

  if (input.pseudo) updateData.pseudo = input.pseudo;
  if (input.password) {
    updateData.passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
  }

  const result = await updateById(id, updateData);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const parsed = PublicUserSchema.safeParse(result.value.toObject({ virtuals: true }));
  if (!parsed.success) return err("INVALID_USER");

  return ok(parsed.data);
};