import { Schema,model } from 'mongoose';

export const userSchema = new Schema({
  _id: { type: String, required: true },
  pseudo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: '' },
  password: { type: String, required: true },
  money: { type: Number, default: 0 },
  myCollection: { type: [String], default: [] },
  deck: { type: [String], default: [] },
  darkMode: { type: Boolean, default: false },
});

export const UserModel = model('User', userSchema);
