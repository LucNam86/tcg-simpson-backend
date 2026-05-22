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
      "❌ Erreur : DATABASE_URL n'est pas défini dans le fichier .env"
    );
    process.exit(1);
  }

  try {
    console.log("🔋 Connexion à MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connecté avec succès.");

    let boostersUpserted = 0;

    for (const booster of boostersData) {
      // 1. On cherche l'id de la série en BDD (ex: "Série 1")
      const serieDoc = await SerieModel.findOne({ name: booster.serie });
      
      if (!serieDoc) {
        console.warn(`⚠️ Série "${booster.serie}" introuvable. Booster "${booster.name}" ignoré.`);
        continue; 
      }

      // 2. Récupération dynamique des ObjectIds des cartes correspondantes à cette série
      // On le fait avant l'upsert pour injecter directement le tableau complet
      const matchingCards = await CardModel.find({ "serie.id_serie": serieDoc._id }).select("_id");
      const cardIds = matchingCards.map(card => card._id);

      // 3. Préparation de l'objet final prêt pour Mongoose
      const preparedBooster = {
        name: booster.name,
        price: booster.price,
        slug: booster.slug,
        quantity: booster.quantity,
        cards: cardIds, // Injecté directement ici !
        serie: serieDoc._id
      };

      // 🎯 L'upsert : On cherche par SLUG. Si trouvé, on update. Sinon, on crée.
      await BoosterModel.findOneAndUpdate(
        { name: booster.name },
        { $set: preparedBooster },
        { upsert: true, new: true }
      );

      boostersUpserted++;
    }


    console.log("🚀 TOUS LES BOOSTERS ONT ÉTÉ SYNCHRONISÉS !");


    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur critique pendant le seeding des boosters :", error);
    process.exit(1);
  }
}

seedBooster();