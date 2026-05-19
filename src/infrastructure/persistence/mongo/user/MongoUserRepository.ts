import { UserRepository } from '@domain/user/UserRepository';
import { User } from '@domain/user/User';
import { makeUser } from '@domain/user/userFactory';
import { Result, ok, err } from '@shared/Result';
import { UserModel } from './userSchema';
import { Email } from '@domain/user/Email';

export function makeMongoUserRepository(): UserRepository {
  async function findById(id: string): Promise<Result<User | null, string>> {
    try {
      const doc = await UserModel.findById(id);
      if (!doc) return ok(null);
      return makeUser({
        id: doc._id,
        pseudo: doc.pseudo,
        email: doc.email as Email,
        avatar: doc.avatar,
        password: doc.password,
        money: doc.money,
        myCollection: doc.myCollection,
        deck: doc.deck,
        darkMode: doc.darkMode,
      });
    } catch (e) {
      return err('Erreur lors de la recherche par id');
    }
  }

  async function findByEmail(email: string): Promise<Result<User | null, string>> {
    try {
      const doc = await UserModel.findOne({ email });
      if (!doc) return ok(null);
      return makeUser({
        id: doc._id,
        pseudo: doc.pseudo,
        email: doc.email as Email,
        avatar: doc.avatar,
        password: doc.password,
        money: doc.money,
        myCollection: doc.myCollection,
        deck: doc.deck,
        darkMode: doc.darkMode,
      });
    } catch (e) {
      return err('Erreur lors de la recherche par email');
    }
  }

  async function save(user: User): Promise<Result<void, string>> {
    try {
      await UserModel.findByIdAndUpdate(
        user.id,
        {
          pseudo: user.pseudo,
          email: user.email,
          avatar: user.avatar,
          password: user.password,
          money: user.money,
          myCollection: user.myCollection,
          deck: user.deck,
          darkMode: user.darkMode,
        },
        { upsert: true, new: true },
      );
      return ok(undefined);
    } catch (e) {
      return err('Erreur lors de la sauvegarde');
    }
  }

  async function deleteById(id: string): Promise<Result<void, string>> {
    try {
      await UserModel.findByIdAndDelete(id);
      return ok(undefined);
    } catch (e) {
      return err('Erreur lors de la suppression');
    }
  }

  return { findById, findByEmail, save, delete: deleteById };
}