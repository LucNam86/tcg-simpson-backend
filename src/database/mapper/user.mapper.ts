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
  countdownEnds: user.countdownEnds,
  myCollection: user.myCollection.map(mapCard),
  boosters: mapUserBoosters(user.boosters),
  decks: user.decks,
  friends: user.friends.map((friend: any) => mapFriend(friend)),
  darkMode: user.darkMode,
});

export function mapUserPublic(user: UserDocument) {
  return {
    id: user._id.toString(),
    pseudo: user.pseudo,
    email: user.email,
    avatar: user.avatar,
    money: user.money,
    countdownEnds: user.countdownEnds,
    darkMode: user.darkMode,
  };
}
export const mapFriend = (friend: any) => {
  const uniqueCardsCount = friend.myCollection
    ? new Set(friend.myCollection.map((cardId: any) => cardId.toString())).size
    : 0;

  return {
    pseudo: friend.pseudo,
    avatar: friend.avatar,
    uniqueCardsCount,
  };
};
