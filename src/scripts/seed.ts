"use client";

import mongoose from "mongoose";
import dotenv from "dotenv";

import { SerieModel } from "../database/models/serie.model";
import { FamilyModel } from "../database/models/family.model";
import { AffinityModel } from "../database/models/affinity.model";
import { CardModel } from "../database/models/card.model";

import seriesData from "./data/series.json";
import familiesData from "./data/families.json";
import affinitiesData from "./data/affinities.json";
import cardsData from "./data/cards.json";

dotenv.config();

async function seedDatabase() {
  const mongoUri = process.env.DATABASE_URL;

  if (!mongoUri) {
    console.error(
      "❌ Erreur : MONGO_URI n'est pas défini dans le fichier .env",
    );
    process.exit(1);
  }

  try {
    console.log("🔋 Connexion à MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connecté avec succès.");

    console.log(
      "📦 Synchronisation des Séries, Familles et Affinités (Upsert)...",
    );

    // 1. Upsert des Séries
    const serieMap: Record<string, mongoose.Types.ObjectId> = {};
    for (const serie of seriesData) {
      const updated = await SerieModel.findOneAndUpdate(
        { name: serie.name },
        { $set: serie },
        { upsert: true, new: true },
      );
      serieMap[serie.name] = updated._id as mongoose.Types.ObjectId;
    }

    // 2. Upsert des Familles
    const familyMap: Record<string, mongoose.Types.ObjectId> = {};
    for (const family of familiesData) {
      const updated = await FamilyModel.findOneAndUpdate(
        { name: family.name },
        { $set: family },
        { upsert: true, new: true },
      );
      familyMap[family.name] = updated._id as mongoose.Types.ObjectId;
    }

    // 3. Upsert des Affinités
    const affinityMap: Record<string, mongoose.Types.ObjectId> = {};
    for (const affinity of affinitiesData) {
      const updated = await AffinityModel.findOneAndUpdate(
        { name: affinity.name },
        { $set: affinity },
        { upsert: true, new: true },
      );
      affinityMap[affinity.name] = updated._id as mongoose.Types.ObjectId;
    }

    console.log(
      "🗺️ Liaison et Synchronisation des cartes (Upsert via Slug)...",
    );

    let cardsUpserted = 0;

    for (const card of cardsData) {
      // Sécurité : Récupération des IDs via les maps générées plus haut
      const familyId = familyMap[card.family] || familyMap["Sans Famille"];
      const affinityId =
        affinityMap[card.affinity] || affinityMap["Sans Affinité"];

      const fallbackSerieId = Object.values(serieMap)[0];
      const serieId = serieMap[card.serie.name_serie] || fallbackSerieId;

      const preparedCard = {
        name: card.name,
        slug: card.slug,
        type: card.type,
        rarity: card.rarity,
        description: card.description || "",
        ATK: card.ATK,
        PV: card.PV,
        family: familyId,
        affinity: affinityId,
        serie: {
          id_serie: serieId,
          position: card.serie.position,
        },
      };

      // Upsert strict basé sur le slug (évite les doublons si seule la rareté change)
      await CardModel.findOneAndUpdate(
        { slug: card.slug },
        { $set: preparedCard },
        { upsert: true, new: true, overwrite: false },
      );

      cardsUpserted++;
    }

    console.log("✨ ------------------------------------------------ ✨");
    console.log("🚀 BASE DE DONNÉES SYNCHRONISÉE SANS PERTE D'IDENTIFIANTS !");
    console.log(
      `📊 Résumé : ${Object.keys(serieMap).length} Série(s), ${Object.keys(familyMap).length} Famille(s), ${Object.keys(affinityMap).length} Affinité(s) et ${cardsUpserted} Cartes vérifiées/mises à jour.`,
    );
    console.log("✨ ------------------------------------------------ ✨");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur critique pendant la synchronisation :", error);
    process.exit(1);
  }
}

seedDatabase().catch((err) => {
  console.error("❌ Échec de l'exécution du script :", err);
  process.exit(1);
});
