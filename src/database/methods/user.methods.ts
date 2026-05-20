// database/methods/user.methods.ts
import { Result, ok, err } from '@shared/Result';
import { UserModel } from '../models/user.model';

export const findUserByEmail = async (email: string): Promise<Result<any, string>> => {
  try {
    const user = await UserModel.findOne({ email });
    return ok(user);
  } catch (e) {
    return err('Erreur lors de la recherche par email');
  }
};

export const saveUser = async (user: any): Promise<Result<void, string>> => {
  try {
    await UserModel.findByIdAndUpdate(user.id, user, { upsert: true, returnDocument: 'after' });
    return ok(undefined);
  } catch (e) {
    return err('Erreur lors de la sauvegarde');
  }
};