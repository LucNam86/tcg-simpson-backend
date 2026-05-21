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

    console.log("🧹 Nettoyage de la base de données...");
    await SerieModel.deleteMany({});
    await FamilyModel.deleteMany({});
    await AffinityModel.deleteMany({});
    await CardModel.deleteMany({});
    console.log("🗑️ Base de données vidée.");

    console.log("📦 Insertion des Séries, Familles et Affinités...");
    const createdSeries = await SerieModel.insertMany(seriesData);
    const createdFamilies = await FamilyModel.insertMany(familiesData);
    const createdAffinities = await AffinityModel.insertMany(affinitiesData);

    const serieMap: Record<string, mongoose.Types.ObjectId> = {};
    createdSeries.forEach((s) => {
      serieMap[s.name] = s._id as mongoose.Types.ObjectId;
    });

    const familyMap: Record<string, mongoose.Types.ObjectId> = {};
    createdFamilies.forEach((f) => {
      familyMap[f.name] = f._id as mongoose.Types.ObjectId;
    });

    const affinityMap: Record<string, mongoose.Types.ObjectId> = {};
    createdAffinities.forEach((a) => {
      affinityMap[a.name] = a._id as mongoose.Types.ObjectId;
    });

    console.log("🗺️ Liaison des cartes avec les identifiants de la base...");
    const preparedCards = cardsData.map((card) => {
      const familyId = familyMap[card.family] || familyMap["Sans Famille"];

      const affinityId =
        affinityMap[card.affinity] || affinityMap["Sans Affinité"];
      const serieId = serieMap[card.serie.name_serie] || createdSeries[0]._id;

      return {
        name: card.name,
        slug: card.slug,
        type: card.type,
        rarity: card.rarity,
        ATK: card.ATK,
        PV: card.PV,
        family: familyId,
        affinity: affinityId,
        serie: {
          id_serie: serieId,
          position: card.serie.position,
        },
      };
    });

    console.log("🃏 Insertion des cartes...");
    await CardModel.insertMany(preparedCards);

    console.log("✨ ------------------------------------------------ ✨");
    console.log("🚀 BASE DE DONNÉES SEEDÉE AVEC SUCCÈS ET SANS LIENS BRISÉS !");
    console.log(
      `📊 Résumé : ${createdSeries.length} Série(s), ${createdFamilies.length} Famille(s), ${createdAffinities.length} Affinité(s), ${preparedCards.length} Cartes.`,
    );
    console.log("✨ ------------------------------------------------ ✨");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur critique pendant le seeding :", error);
    process.exit(1);
  }
}

seedDatabase();
