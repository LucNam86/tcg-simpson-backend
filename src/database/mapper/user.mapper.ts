// database/mappers/user.mapper.ts
import { mapCard } from "./card.mapper";
import { mapUserBoosters } from "./booster.mapper";
import type { PublicUser, PublicUserFull } from "@shared/Schemas/user.schema";
import { UserDocument } from "@database/models/user.model";

export const mapUser = (user: any): PublicUserFull => ({
  id: user._id.toString(),
  pseudo: user.pseudo,
  email: user.email,
  avatar: user.avatar,
  money: user.money,
  myCollection: user.myCollection.map(mapCard),
  boosters: mapUserBoosters(user.boosters),
  decks: user.decks,
  friends: user.friends.map((friend: any) => ({
    pseudo: friend.pseudo,
    avatar: friend.avatar,
  })),
  darkMode: user.darkMode,
});

export function mapUserPublic(user: UserDocument) {
  return {
    id: user._id.toString(),
    pseudo: user.pseudo,
    email: user.email,
    avatar: user.avatar,
    money: user.money,
    darkMode: user.darkMode,
  };
}

export const mapFriend = (friend: any) => ({
  pseudo: friend.pseudo,
  avatar: friend.avatar,
});