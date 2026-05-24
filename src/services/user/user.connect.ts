import { Result, ok, err } from "@shared/Result";
import { findByEmail } from "@database/methods/user";
import bcrypt from "bcrypt";
import { ConnectInput, PublicUser } from "@shared/Schemas/user.schema";

type ConnectError = "CREDENTIALS_UNKNOWN" | "WRONG_CREDENTIALS";

export const connectUser = async (
  input: ConnectInput,
): Promise<Result<PublicUser, ConnectError>> => {
  const existing = await findByEmail(input.email);
  if (!existing.ok || !existing.value) return err("CREDENTIALS_UNKNOWN");
  const compareHashedPassword = bcrypt.compareSync(
    input.password,
    existing.value.passwordHash,
  );
  if (!compareHashedPassword) return err("WRONG_CREDENTIALS");

  return ok({
    id: existing.value.id,
    pseudo: existing.value.pseudo,
    email: existing.value.email,
    avatar: existing.value.avatar,
    money: existing.value.money,
    myCollection: existing.value.myCollection,
    boosters: existing.value.boosters,
    decks: existing.value.decks,
    friends: existing.value.friends || [],
    darkMode: existing.value.darkMode,
  });
};
