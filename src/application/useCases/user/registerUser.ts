import { PasswordHasher,makeEmail, makeUser,UserRepository, User } from '@domain/user';
import { Result, ok, err, RegisterUserPayload } from '@shared/index';
import { randomUUID } from 'crypto';
type Inputs = {
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
};

export type RegisterUserError = 'EMAIL_INVALID' | 'EMAIL_TAKEN' | 'USER_INVALID';

export const createRegisterUserUseCase = (inputs: Inputs) => ({

  execute: async (
    payload: RegisterUserPayload
  ): Promise<Result<User, RegisterUserError>> => {

    // 1. Validation MÉTIER via le Domain (fonction de validation → Result)
    const email = makeEmail(payload.email);
    if (!email.ok) return err('EMAIL_INVALID');

    // 2. Email déjà pris ?
    const existing = await inputs.userRepository.findByEmail(email.value);
    if (existing.ok && existing.value) return err('EMAIL_TAKEN');

    // 3. Hasher le mot de passe (via le Port)
    const hash = await inputs.passwordHasher.hash(payload.password);

    // 4. Construire le User via le Domain
    const user = makeUser({ id: randomUUID(), pseudo: payload.pseudo, email: email.value, passwordHash: hash });
    if (!user.ok) return err('USER_INVALID');

    // 5. Persister (via le Port)
    await inputs.userRepository.save(user.value);
    return ok(user.value);
  }
});