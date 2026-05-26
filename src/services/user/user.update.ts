import { Result, ok, err } from "@shared/Result";
import { updateById, findByIdWithPopulate } from "@database/methods/user";
import { UserDocument } from "@database/models/user.model";
import bcrypt from "bcrypt";
import { UpdateInput, PublicUser } from "@shared/Schemas/user.schema";
import { mapUser } from "@database/mapper";
import { env } from "@config/env";

type UpdateUserError =
  | "USER_NOT_FOUND"
  | "DATABASE_ERROR"
  | "INVALID_USER"
  | "PSEUDO_ALREADY_USED";

export async function updateUser(
  id: string,
  input: UpdateInput & { money?: number },
): Promise<Result<PublicUser, UpdateUserError>> {
  const updateData: Partial<UserDocument> = {};

  if (input.pseudo) updateData.pseudo = input.pseudo;
  if (input.password) {
    updateData.passwordHash = await bcrypt.hash(
      input.password,
      env.BCRYPT_SALT_ROUNDS,
    );
  }
  if (input.money !== undefined) updateData.money = input.money;

  const result = await updateById(id, updateData);

  if (!result.ok) {
    if (result.error === "PSEUDO_ALREADY_USED") return err("PSEUDO_ALREADY_USED");
    return err("DATABASE_ERROR");
  }

  if (!result.value) return err("USER_NOT_FOUND");

  const populatedResult = await findByIdWithPopulate(id);
  if (!populatedResult.ok) return err("DATABASE_ERROR");
  if (!populatedResult.value) return err("USER_NOT_FOUND");

  return ok(mapUser(populatedResult.value));
}