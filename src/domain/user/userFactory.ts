import { User, CreateUserInput } from './User';
import { Result, ok, err } from '@shared/Result';

export function makeUser(inputs: CreateUserInput): Result<User, string> {

  if (inputs.deck && inputs.deck.length > 3) {
    return err('Un utilisateur ne peut pas avoir plus de 3 decks');
  }

  return ok({
    id: inputs.id ?? crypto.randomUUID(),
    pseudo: inputs.pseudo,
    email: inputs.email,
    avatar: inputs.avatar ?? '',
    passwordHash: inputs.passwordHash,
    money: inputs.money ?? 0,
    myCollection: inputs.myCollection ?? [],
    deck: inputs.deck ?? [],
    darkMode: inputs.darkMode ?? false,
  });
}