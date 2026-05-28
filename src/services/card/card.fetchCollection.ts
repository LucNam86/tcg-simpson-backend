import { Result, ok, err } from "@shared/Result";
import { findByIdWithCollection } from "@database/methods/user";
import { mapCard } from "@database/mapper";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR";
type MappedCard = ReturnType<typeof mapCard>;

export async function fetchUserCollection(
  id: string,
  filters: { q?: string; rarity?: string[]; type?: string[]; serie?: string[] },
): Promise<Result<MappedCard[], GetUserError>> {
  const result = await findByIdWithCollection(id);
  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  let collection = result.value.myCollection || [];

  if (filters.q && filters.q.trim() !== "") {
    const searchLower = filters.q.toLowerCase().trim();
    collection = collection.filter((card: any) => {
      const matchName = card.name?.toLowerCase().includes(searchLower);
      const matchDesc = card.description?.toLowerCase().includes(searchLower);
      const matchFamily = card.family?.name?.toLowerCase().includes(searchLower);
      const matchAffinity = card.affinity?.name?.toLowerCase().includes(searchLower);
      const matchType = card.type?.toLowerCase().includes(searchLower);
      return matchName || matchDesc || matchFamily || matchAffinity || matchType;
    });
  }

 if (filters.rarity && filters.rarity.length > 0) {
  collection = collection.filter((card: any) => filters.rarity?.includes(card.rarity));
}
if (filters.type && filters.type.length > 0) {
  collection = collection.filter((card: any) => filters.type?.includes(card.type));
}
if (filters.serie && filters.serie.length > 0) {
  collection = collection.filter((card: any) => filters.serie?.includes(card.serie?.id_serie.name));
}

  return ok(collection.map(mapCard));
}