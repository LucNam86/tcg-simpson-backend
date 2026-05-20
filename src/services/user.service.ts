// services/user.service.ts
import { Result, ok, err } from "../shared/Result";
import {
  findUserByEmail,
  saveUser,
  findUserById,
  updateUserById,
} from "../database/methods/user.methods";
import { UserDocument } from "../database/models/user.model";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

type CreateUserInput = {
  pseudo: string;
  email: string;
  password: string;
};

type ConnectUserInput = {
  email: string;
  password: string;
};
type ConnectUserError = "CREDENTIALS_UNKNOWN" | "WRONG_CREDENTIALS";
type CreateUserError = "EMAIL_TAKEN" | "USER_CREATION_FAILED";
type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR";

type UpdateUserInput = {
  pseudo?: string;
  password?: string;
};

export const createUser = async (
  input: CreateUserInput,
): Promise<Result<{ id: string }, CreateUserError>> => {
  const existing = await findUserByEmail(input.email);
  if (existing.ok && existing.value) return err("EMAIL_TAKEN");

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = {
    pseudo: input.pseudo,
    email: input.email.toLowerCase(),
    passwordHash,
    avatar: "",
    money: 100,
    myCollection: [],
    deck: [],
    darkMode: false,
  };

  const saved = await saveUser(user);
  if (!saved.ok) return err("USER_CREATION_FAILED");

  return ok({ id: saved.value });
};

export const connectUser = async (
  input: ConnectUserInput,
): Promise<Result<{ id: string }, ConnectUserError>> => {
  const existing = await findUserByEmail(input.email);
  if (!existing.ok || !existing.value) return err("CREDENTIALS_UNKNOWN");
  const compareHashedPassword = bcrypt.compareSync(
    input.password,
    existing.value.passwordHash,
  );
  if (!compareHashedPassword) return err("WRONG_CREDENTIALS");

  return ok({ id: existing.value });
};

export const getUserById = async (
  id: string,
): Promise<
  Result<Omit<UserDocument, "passwordHash" | "_id" | "__v">, GetUserError>
> => {
  const result = await findUserById(id);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const user = result.value.toObject();
  const { passwordHash, _id, __v, ...userClean } = user;

  return ok(userClean);
};

export const updateUser = async (
  id: string,
  input: UpdateUserInput,
): Promise<
  Result<Omit<UserDocument, "passwordHash" | "_id" | "__v">, GetUserError>
> => {
  const updateData: Partial<UserDocument> = {};

  if (input.pseudo) {
    updateData.pseudo = input.pseudo;
  }

  if (input.password) {
    updateData.passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  }

  const result = await updateUserById(id, updateData);

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const user = result.value.toObject();

  const { passwordHash, _id, __v, ...userClean } = user;

  return ok(userClean);
};
