import { Result, ok, err } from "@shared/Result";
import { findByEmail, findByIdWithPopulate } from "@database/methods/user";
import bcrypt from "bcrypt";
import { ConnectInput, PublicUser } from "@shared/Schemas/user.schema";
import { mapUser } from "@database/mapper";

type ConnectError = "CREDENTIALS_UNKNOWN" | "WRONG_CREDENTIALS" | "DATABASE_ERROR";

export async function connectUser(
  input: ConnectInput,
): Promise<Result<PublicUser, ConnectError>> {
  const existing = await findByEmail(input.email);
  console.log("Existing user:", existing);
  if (!existing.ok || !existing.value) return err("CREDENTIALS_UNKNOWN");

  const passwordMatch = bcrypt.compareSync(input.password, existing.value.passwordHash);
  if (!passwordMatch) return err("WRONG_CREDENTIALS");

  const populatedResult = await findByIdWithPopulate(existing.value._id.toString());
  if (!populatedResult.ok) return err("DATABASE_ERROR");
  if (!populatedResult.value) return err("CREDENTIALS_UNKNOWN");

  return ok(mapUser(populatedResult.value));
}