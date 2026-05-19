import { Email } from './Email';

export type CreateUserInput = {
  id?: string;
  pseudo: string;
  email: Email;
  avatar?: string;
  password: string;
  money?: number;
  myCollection?: string[];
  deck?: string[];
  darkMode?: boolean;
};