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