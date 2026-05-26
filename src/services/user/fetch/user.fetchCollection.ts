import { Result, ok, err } from "@shared/Result";
import { findByIdWithCollection } from "@database/methods/user";
import { PublicCardArray } from "@shared/Schemas/card.schema";
import { mapCard } from "@database/mapper";

type GetUserError = "USER_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_USER";

export async function fetchUserCollection(
  id: string,
  filters: { q?: string; rarity?: string[]; type?: string[]; serie?: string[] },
): Promise<Result<PublicCardArray, GetUserError>> {
  const result = await findByIdWithCollection(id);
  if (!result.ok) return err("DATABASE_ERROR");
  if (!result.value) return err("USER_NOT_FOUND");

  let collection = result.value.myCollection || [];

  // 2. CORRECTION DU FILTRE TEXTUEL MULTI-CHAMPS
  if (filters.q && filters.q.trim() !== "") {
    const searchLower = filters.q.toLowerCase().trim();

  collection = collection.filter((card: any) => {
      // On vérifie si la recherche match avec l'un des champs de la carte
      const matchName = card.name?.toLowerCase().includes(searchLower);
      const matchDesc = card.description?.toLowerCase().includes(searchLower);
      const matchFamily = card.family?.name?.toLowerCase().includes(searchLower);
      const matchAffinity = card.affinity?.name?.toLowerCase().includes(searchLower);
      const matchType = card.type?.toLowerCase().includes(searchLower);

      // Si l'un de ces champs contient le texte recherché, on garde la carte !
      return matchName || matchDesc || matchFamily || matchAffinity || matchType;
    });
  }

  if (filters.rarity) {
    collection = collection.filter((card: any) =>
      filters.rarity?.includes(card.rarity),
    );
  }
  if (filters.type) {
    collection = collection.filter((card: any) =>
      filters.type?.includes(card.type),
    );
  }
  if (filters.serie) {
    collection = collection.filter((card: any) =>
      filters.serie?.includes(card.serie?.id_serie.name),
    );
  }

  return ok(collection.map(mapCard));
}
