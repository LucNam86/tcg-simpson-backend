import { Result, ok, err } from "@shared/Result";
import { findAllCards } from "@database/methods/card/card.find";
import { mapCard } from "@database/mapper/card.mapper";

type GetCardError = "DATABASE_ERROR" | "NO_CARDS";
type MappedCard = ReturnType<typeof mapCard>;

export async function fetchCards(
  filters: { q?: string; rarity?: string[]; type?: string[]; serie?: string[] }
): Promise<Result<MappedCard[], GetCardError>> {
  const result = await findAllCards();

  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("NO_CARDS");

  let collection = result.value || [];

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