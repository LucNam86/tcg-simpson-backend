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

      // 2. Construction dynamique du filtre de requêtage des cartes
      const cardFilter: any = { "serie.id_serie": serieDoc._id };

      // Condition spécifique : Si c'est le booster légendaire, on restreint aux raretés 2 (Rare) et 3 (Légendaire)
      if (booster.name === "Booster légendaire") {
        cardFilter.rarity = { $in: ["2", "3"] };
        console.log(`✨ Filtrage des cartes pour "${booster.name}" : Uniquement Rares ("2") et Légendaires ("3")`);
      }

      // 3. Récupération des ObjectIds des cartes correspondantes au filtre
      const matchingCards = await CardModel.find(cardFilter).select("_id");
      const cardIds = matchingCards.map(card => card._id);

      console.log(`📦 Booster "${booster.name}" lié à ${cardIds.length} cartes potentielles.`);

      // 4. Préparation de l'objet final avec les probabilités incluses !
      const preparedBooster = {
        name: booster.name,
        price: booster.price,
        slug: booster.slug,
        quantity: booster.quantity,
        cards: cardIds,
        serie: serieDoc._id,
        probabilities: booster.probabilities // 🌟 Injecté directement depuis le JSON
      };

      // 5. L'upsert : On cherche par NOM. Si trouvé, on update (écrase avec $set). Sinon, on crée.
      await BoosterModel.findOneAndUpdate(
        { name: booster.name },
        { $set: preparedBooster },
        { upsert: true, new: true }
      );

      boostersUpserted++;
    }

    console.log(`\n🚀 TOUS LES BOOSTERS (${boostersUpserted}) ONT ÉTÉ SYNCHRONISÉS AVEC LEURS PROBABILITÉS !`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur critique pendant le seeding des boosters :", error);
    process.exit(1);
  }
}

seedBooster();