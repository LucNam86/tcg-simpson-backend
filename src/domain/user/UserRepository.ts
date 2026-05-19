import { User } from './User';
import { Result } from '@shared/Result';

export interface UserRepository {
  findById(id: string): Promise<Result<User | null, string>>;
  findByEmail(email: string): Promise<Result<User | null, string>>;
  save(user: User): Promise<Result<void, string>>;
  delete(id: string): Promise<Result<void, string>>;
}