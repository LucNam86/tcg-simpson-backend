import bcrypt from 'bcrypt';
import { PasswordHasher } from '@domain/user/PasswordHasher';

const SALT_ROUNDS = 12;

export const createBcryptPasswordHasher = (): PasswordHasher => ({
  hash: (plain: string) => bcrypt.hash(plain, SALT_ROUNDS),
  compare: (plain: string, hash: string) => bcrypt.compare(plain, hash),
});