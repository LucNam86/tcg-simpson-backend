import { Result, ok, err } from "@shared/Result";
import { findByEmail } from "@database/methods/user";
import { mapUserPublic } from "@database/mapper/user.mapper";
import bcrypt from "bcrypt";
import { ConnectInput, PublicUser } from "@shared/Schemas/user.schema";

type ConnectError = "CREDENTIALS_UNKNOWN" | "WRONG_CREDENTIALS" | "DATABASE_ERROR";

export async function connectUser(
  input: ConnectInput,
): Promise<Result<PublicUser, ConnectError>> {
  const existing = await findByEmail(input.email);

  if (!existing.ok || !existing.value) return err("CREDENTIALS_UNKNOWN");

  const passwordMatch = bcrypt.compareSync(input.password, existing.value.passwordHash);
  if (!passwordMatch) return err("WRONG_CREDENTIALS");

  return ok(mapUserPublic(existing.value));
}