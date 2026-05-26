import { Result, ok, err } from "@shared/Result";
import {PublicCard } from "@shared/Schemas/card.schema";
import {findAllCards} from "@database/methods/card/card.find";
import { mapCard } from "@database/mapper/card.mapper";

type GetCardError = "DATABASE_ERROR" | "NO_CARDS"

export const fetchCards = async (): Promise<Result<PublicCard[], GetCardError>> => {
  const result = await findAllCards();

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("NO_CARDS");

  return ok(result.value.map(mapCard));
};