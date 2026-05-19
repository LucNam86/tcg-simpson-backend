import { Email } from './Email';

export type User = {
  id: string;
  pseudo: string;
  email: Email;
  avatar: string;
  passwordHash: string;
  money: number;
  myCollection: string[];
  deck: string[];
  darkMode: boolean;
};

export type CreateUserInput = {
  id?: string;
  pseudo: string;
  email: Email;
  passwordHash: string;
  avatar?: string;
  money?: number;
  myCollection?: string[];
  deck?: string[];
  darkMode?: boolean;
};