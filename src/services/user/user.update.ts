import { Result, ok, err } from "@shared/Result";
import { updateById, findById } from "@database/methods/user";
import { UserDocument } from "@database/models/user.model";
import bcrypt from "bcrypt";
import { UpdateInput } from "@shared/Schemas/user.schema";
import { env } from "@config/env";

type UpdateUserError =
  | "USER_NOT_FOUND"
  | "DATABASE_ERROR"
  | "PSEUDO_ALREADY_USED";

export interface UpdatedUser {
  pseudo: string;
  money: number;
}

export async function updateUser(
  id: string,
  input: UpdateInput & { money?: number },
): Promise<Result<UpdatedUser, UpdateUserError>> {
  const updateData: Partial<UserDocument> = {};

  if (input.pseudo) updateData.pseudo = input.pseudo;
  if (input.password) {
    updateData.passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
  }
  if (input.money !== undefined) updateData.money = input.money;

  const result = await updateById(id, updateData);

  if (!result.ok) {
    if (result.error === "PSEUDO_ALREADY_USED") return err("PSEUDO_ALREADY_USED");
    return err("DATABASE_ERROR");
  }

  if (!result.value) return err("USER_NOT_FOUND");

  return ok({
    pseudo: result.value.pseudo,
    money: result.value.money,
  });
}