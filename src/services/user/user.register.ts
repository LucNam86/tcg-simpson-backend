// services/user.service.ts
import { Result, ok, err } from "@shared/Result";
import { findByEmail, findByPseudo, save } from "@database/methods/user";
import {find} from "@database/methods/booster";
import bcrypt from "bcrypt";
import { RegisterInput, PublicUser } from "@shared/Schemas/user.schema";
import {mapBoostersFromFind } from "@database/mapper/booster.mapper";
import { env } from "@config/env";

type RegisterError = "EMAIL_TAKEN" | "PSEUDO_TAKEN" | "USER_CREATION_FAILED" | "DATABASE_ERROR";

export async function registerUser(
  input: RegisterInput,
): Promise<Result<PublicUser, RegisterError>> {

  const existingEmail = await findByEmail(input.email);

  if (existingEmail.ok && existingEmail.value) return err("EMAIL_TAKEN");

  const existingPseudo = await findByPseudo(input.pseudo);

  if (existingPseudo.ok && existingPseudo.value) return err("PSEUDO_TAKEN");

  if (!existingEmail.ok) return err("DATABASE_ERROR");
  if (!existingPseudo.ok) return err("DATABASE_ERROR");

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);

  const boosters = await find();
  if (!boosters.ok) return err("DATABASE_ERROR");


  const user = {
    pseudo: input.pseudo,
    email: input.email.toLowerCase(),
    passwordHash,
    avatar: "",
    money: 100,
    myCollection: [],
    boosters: boosters.value.map((booster) => ({
      booster: booster._id,
      number: 1,
  })),
    decks: [],
    darkMode: false,
  };

  const saved = await save(user);
  if (!saved.ok) return err("USER_CREATION_FAILED");

  return ok({
    id: saved.value,
    pseudo: user.pseudo,
    email: user.email,
    avatar: user.avatar,
    money: user.money,
    myCollection: user.myCollection,
    boosters: mapBoostersFromFind(boosters.value),
    decks: user.decks,
    friends: [],
    darkMode: user.darkMode,
  });
};