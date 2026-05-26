// database/mappers/user.mapper.ts
import { mapCard } from "./card.mapper";
import { mapUserBoosters } from "./booster.mapper";
import type { PublicUser } from "@shared/Schemas/user.schema";

export const mapUser = (user: any): PublicUser => ({
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

export const mapFriend = (friend: any) => ({
  pseudo: friend.pseudo,
  avatar: friend.avatar,
});