import { Result, ok, err } from "@shared/Result";
import { UserModel } from "@database/models/user.model";
import { DeckDocument } from "@database/models/deck.model";

export const fetchDecks = async (
  userId: string,
): Promise<Result<DeckDocument[], string>> => {
  try {
    const user = await UserModel.findById(userId).populate({
      path: "decks",
      populate: { path: "cards" },
    });

    if (!user) return err("USER_NOT_FOUND");

    return ok(user.decks as unknown as DeckDocument[]);
  } catch (e: any) {
    console.error("fetchDecks error:", JSON.stringify(e, null, 2));
    return err("Erreur lors de la récupération des decks");
  }
};
