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

    // 1. Nettoyage de la collection des Boosters
    await BoosterModel.deleteMany({});

    // 2. Préparation dynamique des boosters avec leurs vrais ObjectIds de Série
    const preparedBoosters = [];

    for (const booster of boostersData) {
      // On cherche l'id de la série en BDD (ex: "Série 1")
      const serieDoc = await SerieModel.findOne({ name: booster.serie });
      
      if (!serieDoc) {
        continue; 
      }

      // On crée l'objet final prêt pour Mongoose
      preparedBoosters.push({
        name: booster.name,
        price: booster.price,
        slug: booster.slug,
        quantity: booster.quantity,
        cards: [],          // Initialisé à vide au début
        serie: serieDoc._id // 👈 On injecte le vrai ObjectId de la série ici !
      });
    }

    // 3. Insertion de tous les boosters configurés
    await BoosterModel.insertMany(preparedBoosters);

    for (const booster of preparedBoosters) {
      // Vu qu'on a déjà l'id de la série dans l'objet, on cherche directement les cartes correspondantes
      const matchingCards = await CardModel.find({ "serie.id_serie": booster.serie }).select("_id");
      const cardIds = matchingCards.map(card => card._id);
      
      if (cardIds.length === 0) {
        continue;
      }

      // Injection des cartes dans le tableau cards
      await BoosterModel.updateOne(
        { name: booster.name }, 
        { $set: { cards: cardIds } }
      );

    }

    console.log("🚀 TOUS LES BOOSTERS ONT ÉTÉ TRAITÉS, ENREGISTRÉS ET PEUPLÉS !");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur critique pendant le seeding des boosters :", error);
    process.exit(1);
  }
}

seedBooster();