"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const serie_model_1 = require("../database/models/serie.model");
const family_model_1 = require("../database/models/family.model");
const affinity_model_1 = require("../database/models/affinity.model");
const card_model_1 = require("../database/models/card.model");
const series_json_1 = __importDefault(require("./data/series.json"));
const families_json_1 = __importDefault(require("./data/families.json"));
const affinities_json_1 = __importDefault(require("./data/affinities.json"));
const cards_json_1 = __importDefault(require("./data/cards.json"));
dotenv_1.default.config();
async function seedDatabase() {
    const mongoUri = process.env.DATABASE_URL;
    if (!mongoUri) {
        console.error("❌ Erreur : MONGO_URI n'est pas défini dans le fichier .env");
        process.exit(1);
    }
    try {
        console.log("🔋 Connexion à MongoDB...");
        await mongoose_1.default.connect(mongoUri);
        console.log("✅ Connecté avec succès.");
        console.log("📦 Synchronisation des Séries, Familles et Affinités (Upsert)...");
        // 1. Upsert des Séries
        const serieMap = {};
        for (const serie of series_json_1.default) {
            const updated = await serie_model_1.SerieModel.findOneAndUpdate({ name: serie.name }, { $set: serie }, { upsert: true, new: true });
            serieMap[serie.name] = updated._id;
        }
        // 2. Upsert des Familles
        const familyMap = {};
        for (const family of families_json_1.default) {
            const updated = await family_model_1.FamilyModel.findOneAndUpdate({ name: family.name }, { $set: family }, { upsert: true, new: true });
            familyMap[family.name] = updated._id;
        }
        // 3. Upsert des Affinités
        const affinityMap = {};
        for (const affinity of affinities_json_1.default) {
            const updated = await affinity_model_1.AffinityModel.findOneAndUpdate({ name: affinity.name }, { $set: affinity }, { upsert: true, new: true });
            affinityMap[affinity.name] = updated._id;
        }
        console.log("🗺️ Liaison et Synchronisation des cartes (Upsert via Slug)...");
        let cardsUpserted = 0;
        for (const card of cards_json_1.default) {
            // Sécurité : Récupération des IDs via les maps générées plus haut
            const familyId = familyMap[card.family] || familyMap["Sans Famille"];
            const affinityId = affinityMap[card.affinity] || affinityMap["Sans Affinité"];
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
            await card_model_1.CardModel.findOneAndUpdate({ slug: card.slug }, { $set: preparedCard }, { upsert: true, new: true, overwrite: false });
            cardsUpserted++;
        }
        console.log("✨ ------------------------------------------------ ✨");
        console.log("🚀 BASE DE DONNÉES SYNCHRONISÉE SANS PERTE D'IDENTIFIANTS !");
        console.log(`📊 Résumé : ${Object.keys(serieMap).length} Série(s), ${Object.keys(familyMap).length} Famille(s), ${Object.keys(affinityMap).length} Affinité(s) et ${cardsUpserted} Cartes vérifiées/mises à jour.`);
        console.log("✨ ------------------------------------------------ ✨");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Erreur critique pendant la synchronisation :", error);
        process.exit(1);
    }
}
seedDatabase().catch((err) => {
    console.error("❌ Échec de l'exécution du script :", err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map