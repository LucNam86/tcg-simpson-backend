import { PublicCard } from "@shared/Schemas/card.schema";
import type { PopulatedCardDocument } from "@database/interfaces/card.interface";

export const mapCard = (card: PopulatedCardDocument): PublicCard => ({
  id: card._id.toString(),
  name: card.name,
  ATK: card.ATK,
  PV: card.PV,
  description: card.description,
  slug: card.slug,
  rarity: card.rarity,
  type: card.type,
  serie: {
    id_serie: {
      id: card.serie.id_serie._id.toString(),
      name: card.serie.id_serie.name,
    },
    position: card.serie.position,
  },
  family: { id: card.family._id.toString(), name: card.family.name, description: card.family.description, bonus: card.family.bonus },
  affinity: { id: card.affinity._id.toString(), name: card.affinity.name, description: card.affinity.description, bonus: card.affinity.bonus },
});