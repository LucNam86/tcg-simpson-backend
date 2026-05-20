// services/user.service.ts
import { Result, ok, err } from '../shared/Result';
import { findUserByEmail, saveUser, findUserByPseudo } from '../database/methods/user.methods';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const SALT_ROUNDS = 12;

type CreateUserInput = {
  pseudo: string;
  email: string;
  password: string;
};

type ConnectUserInput = {
  pseudo: string;
  password: string;
}

type CreateUserError = 'EMAIL_TAKEN' | 'USER_CREATION_FAILED';
type ConnectUserError = 'CREDENTIALS_UNKNOWN' | 'WRONG_CREDENTIALS';

export const createUser = async (
  input: CreateUserInput
): Promise<Result<{ id: string }, CreateUserError>> => {

  const existing = await findUserByEmail(input.email);
  if (existing.ok && existing.value) return err('EMAIL_TAKEN');

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = {
    id: randomUUID(),
    pseudo: input.pseudo,
    email: input.email.toLowerCase(),
    passwordHash,
    avatar: '',
    money: 100,
    myCollection: [],
    deck: [],
    darkMode: false,
  };

  const saved = await saveUser(user);
  if (!saved.ok) return err('USER_CREATION_FAILED');

  return ok({ id: user.id });
};

export const connectUser = async (
  input : ConnectUserInput
): Promise<Result<{ id: string }, ConnectUserError>> => {

  const existing = await findUserByPseudo(input.pseudo);
  if (!existing.ok || !existing.value) return err('CREDENTIALS_UNKNOWN');
  const compareHashedPassword = bcrypt.compareSync(input.password, existing.value.passwordHash);
  if (!compareHashedPassword) return err('WRONG_CREDENTIALS')

    return ok({ id: existing.value.pseudo })

}