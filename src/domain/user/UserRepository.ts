import { User } from './User';
import { Result } from '@shared/Result';

export interface UserRepository {
  findByEmail(email: string): Promise<Result<User | null, string>>;
  save(user: User): Promise<Result<void, string>>;
}