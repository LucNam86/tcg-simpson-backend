import { UserRepository } from '@domain/user/UserRepository';
import { User } from '@domain/user/User';
import { makeUser } from '@domain/user/userFactory';
import { Result, ok, err } from '@shared/Result';
import { UserModel } from './userModel';
import { makeEmail } from '@domain/user/Email';

const docToUser = (doc: any): Result<User, string> => {
  const email = makeEmail(doc.email);
  if (!email.ok) return err('Email invalide en base');

  return makeUser({
    id: doc._id.toString(),
    pseudo: doc.pseudo,
    email: email.value,      // ← branded proprement
    avatar: doc.avatar,
    passwordHash: doc.passwordHash,  // ← renommé
    money: doc.money,
    myCollection: doc.myCollection,
    deck: doc.deck,
    darkMode: doc.darkMode,
  });
};

export function makeMongoUserRepository(): UserRepository {


  async function findByEmail(email: string): Promise<Result<User | null, string>> {
    try {
      const doc = await UserModel.findOne({ email });
      if (!doc) return ok(null);
      return docToUser(doc);
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
          passwordHash: user.passwordHash,  // ← renommé
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

  return {findByEmail, save};
}