import { Email } from './Email';

export type User = {
  id: string;
  pseudo: string;
  email: Email;
  avatar: string;
  password: string;
  money: number;
  myCollection: string[];
  deck: string[];
  darkMode: boolean;
};

export type CreateUserInput = Partial<User> & Required<Pick<User, 'pseudo' | 'email' | 'password'>>;