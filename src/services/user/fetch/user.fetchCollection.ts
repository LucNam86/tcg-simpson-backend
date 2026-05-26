import { Result, ok, err } from "@shared/Result";
import { findByIdWithCollection } from "@database/methods/user";
import { PublicCardArray } from "@shared/Schemas/card.schema";
import { mapCard } from "@database/mapper";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";

export async function fetchUserCollection(
  id: string,
  filters: { rarity?: string[]; type?: string[]; serie?: string[] },
): Promise<Result<PublicCardArray, GetUserError>> {
  const result = await findByIdWithCollection(id);
  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  const obj = result.value.toObject({ virtuals: true });
  let collection = obj.myCollection || [];

  if (filters.rarity) {
    collection = collection.filter((card: any) => filters.rarity?.includes(card.rarity));
  }
  if (filters.type) {
    collection = collection.filter((card: any) => filters.type?.includes(card.type));
  }
  if (filters.serie) {
    collection = collection.filter((card: any) =>
      filters.serie?.includes(card.serie?.id_serie.name)
    );
  }

  return ok(collection.map(mapCard));
}
