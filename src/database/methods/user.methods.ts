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

export const saveUser = async (user: any): Promise<Result<string, string>> => {
  try {
    const doc = await UserModel.create(user);
    return ok(doc._id.toString());
  } catch (e) {
    console.error('saveUser error:', JSON.stringify(e, null, 2));
    return err('Erreur lors de la sauvegarde');
  }
};