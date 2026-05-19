import { User, CreateUserInput } from './User';
import { Result, ok, err } from '@shared/Result';
import { makeEmail } from './Email';

export function makeUser(inputs: CreateUserInput): Result<User, string> {
  const emailResult = makeEmail(inputs.email);
  if (!emailResult.ok) return err(emailResult.error);

  if (inputs.deck && inputs.deck.length > 3) {
    return err('Un utilisateur ne peut pas avoir plus de 3 decks');
  }

  return ok({
    id: inputs.id ?? crypto.randomUUID(),
    pseudo: inputs.pseudo,
    email: emailResult.value,
    avatar: inputs.avatar ?? '',
    password: inputs.password,
    money: inputs.money ?? 0,
    myCollection: inputs.myCollection ?? [],
    deck: inputs.deck ?? [],
    darkMode: inputs.darkMode ?? false,
  });
}