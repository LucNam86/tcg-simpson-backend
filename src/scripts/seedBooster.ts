import mongoose from "mongoose";
import dotenv from "dotenv";

import { BoosterModel } from "../database/models/booster.model";
import { CardModel } from "../database/models/card.model";
import { SerieModel } from "../database/models/serie.model";

import boostersData from "./data/boosters.json";

dotenv.config();

async function seedBooster() {
  const mongoUri = process.env.DATABASE_URL;

  if (!mongoUri) {
    console.error(
      "❌ Erreur : DATABASE_URL n'est pas défini dans le fichier .env",
    );
    process.exit(1);
  }

  try {
    console.log("🔋 Connexion à MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connecté avec succès.");

    let boostersUpserted = 0;

    for (const booster of boostersData) {
      let cardFilter: any = {};
      let mainSerieId: mongoose.Types.ObjectId | null = null;

      // 1. Cas particulier pour le Booster légendaire (multi-séries)
      if (booster.name === "Booster légendaire") {
        // On cherche les documents des deux séries
        const seriesDocs = await SerieModel.find({
          name: { $in: ["Série 1", "Série 2"] },
        });

        if (seriesDocs.length === 0) {
          console.warn(
            `⚠️ Les séries pour "${booster.name}" sont introuvables. Booster ignoré.`,
          );
          continue;
        }

        const seriesIds = seriesDocs.map((s) => s._id);
        // On garde la première série trouvée comme référence principale pour le schéma du booster
        mainSerieId = seriesDocs[0]._id as mongoose.Types.ObjectId;

        // Filtre : cartes de la série 1 OU série 2 ET rareté Rare ("2") ou Légendaire ("3")
        cardFilter = {
          "serie.id_serie": { $in: seriesIds },
          rarity: { $in: ["2", "3"] },
        };

        console.log(
          `✨ Filtrage multi-séries pour "${booster.name}" : Rares ("2") et Légendaires ("3") des Séries 1 et 2.`,
        );
      } else {
        // 2. Cas standard pour les boosters classiques mono-série
        const serieDoc = await SerieModel.findOne({ name: booster.serie });

        if (!serieDoc) {
          console.warn(
            `⚠️ Série "${booster.serie}" introuvable. Booster "${booster.name}" ignoré.`,
          );
          continue;
        }

        mainSerieId = serieDoc._id as mongoose.Types.ObjectId;
        cardFilter = { "serie.id_serie": mainSerieId };
      }

      // 3. Récupération des ObjectIds des cartes correspondantes au filtre
      const matchingCards = await CardModel.find(cardFilter).select("_id");
      const cardIds = matchingCards.map((card) => card._id);

      console.log(
        `📦 Booster "${booster.name}" lié à ${cardIds.length} cartes potentielles.`,
      );

      // 4. Préparation de l'objet final
      const preparedBooster = {
        name: booster.name,
        price: booster.price,
        slug: booster.slug,
        quantity: booster.quantity,
        cards: cardIds, // Contient désormais les cartes Rares et Légendaires des 2 séries !
        serie: mainSerieId,
        probabilities: booster.probabilities,
      };

      // 5. Upsert par le NOM du booster
      await BoosterModel.findOneAndUpdate(
        { name: booster.name },
        { $set: preparedBooster },
        { upsert: true, new: true },
      );

      boostersUpserted++;
    }

    console.log(
      `\n🚀 TOUS LES BOOSTERS (${boostersUpserted}) ONT ÉTÉ SYNCHRONISÉS AVEC SUCCÈS !`,
    );
    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Erreur critique pendant le seeding des boosters :",
      error,
    );
    process.exit(1);
  }
}

seedBooster();
