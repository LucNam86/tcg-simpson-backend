"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const card_sell_1 = require("../../../services/card/card.sell");
const userMethods = __importStar(require("../../../database/methods/user"));
const userMoneyMethods = __importStar(require("../../../database/methods/user/update/user.updateMoneyById"));
const Result_1 = require("../../../shared/Result");
// Mock des dépendances externes
globals_1.jest.mock("@database/methods/user");
globals_1.jest.mock("@database/methods/user/update/user.updateMoneyById");
(0, globals_1.describe)("sellCollectionCards", () => {
    const userId = "user-123";
    const cardIdToSell = "card-rare";
    // Des cartes de mock réutilisables
    const mockRareCard = { _id: "card-rare", rarity: "2", name: "Super Dragon" };
    const mockCommonCard = { _id: "card-common", rarity: "1", name: "Gobelin" };
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)("succès", () => {
        (0, globals_1.it)("devrait vendre une carte avec succès, mettre à jour la collection et le solde", async () => {
            // L'utilisateur possède 2 fois la carte rare (quantité suffisante pour en vendre 1)
            const mockUserDoc = {
                _id: userId,
                money: 100,
                myCollection: [mockRareCard, mockRareCard, mockCommonCard],
            };
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockUserDoc));
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)({}));
            // updateMoneyById renvoie la nouvelle valeur du solde (100 + 25 = 125)
            globals_1.jest.mocked(userMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(125));
            const result = await (0, card_sell_1.sellCollectionCards)(userId, cardIdToSell, 1);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                // Rareté "2" vaut 25. 25 * 1 = 25 donuts gagnés
                (0, globals_1.expect)(result.value).toEqual({
                    earnedDonuts: 25,
                    money: 125,
                });
            }
            // Vérifie qu'on a retiré exactement UNE instance de la carte vendue
            (0, globals_1.expect)(userMethods.updateById).toHaveBeenCalledWith(userId, {
                myCollection: ["card-rare", "card-common"],
            });
            // Vérifie qu'on a mis à jour l'argent avec le bon montant calculé
            (0, globals_1.expect)(userMoneyMethods.updateMoneyById).toHaveBeenCalledWith(userId, 125);
        });
        (0, globals_1.it)("devrait utiliser le prix par défaut (5) si la rareté n'est pas dans la liste", async () => {
            const mockUnknownRarityCard = { _id: "card-unknown", rarity: "999", name: "Mystère" };
            const mockUserDoc = {
                _id: userId,
                money: 50,
                myCollection: [mockUnknownRarityCard, mockUnknownRarityCard],
            };
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockUserDoc));
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)({}));
            globals_1.jest.mocked(userMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.ok)(55));
            const result = await (0, card_sell_1.sellCollectionCards)(userId, "card-unknown", 1);
            (0, globals_1.expect)(result.ok).toBe(true);
            if (result.ok) {
                (0, globals_1.expect)(result.value.earnedDonuts).toBe(5); // Prix par défaut
            }
        });
    });
    (0, globals_1.describe)("erreurs de validation et métier", () => {
        (0, globals_1.it)("devrait retourner INSUFFICIENT_QUANTITY si la carte n'est pas dans la collection", async () => {
            const mockUserDoc = {
                _id: userId,
                myCollection: [mockCommonCard],
            };
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockUserDoc));
            const result = await (0, card_sell_1.sellCollectionCards)(userId, cardIdToSell, 1);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("INSUFFICIENT_QUANTITY");
            }
        });
        (0, globals_1.it)("devrait retourner INSUFFICIENT_QUANTITY si le joueur essaie de vendre toutes ses cartes (doit en rester au moins 1)", async () => {
            // Le joueur possède 2 cartes, mais veut en vendre 2. 2 - 2 < 1 -> Erreur
            const mockUserDoc = {
                _id: userId,
                myCollection: [mockRareCard, mockRareCard],
            };
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockUserDoc));
            const result = await (0, card_sell_1.sellCollectionCards)(userId, cardIdToSell, 2);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("INSUFFICIENT_QUANTITY");
            }
        });
    });
    (0, globals_1.describe)("erreurs techniques / serveurs", () => {
        (0, globals_1.it)("devrait retourner DATABASE_ERROR si findByIdWithCollection échoue", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.err)("DB_ERROR"));
            const result = await (0, card_sell_1.sellCollectionCards)(userId, cardIdToSell, 1);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("DATABASE_ERROR");
            }
        });
        (0, globals_1.it)("devrait retourner USER_NOT_FOUND si l'utilisateur n'existe pas", async () => {
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(null));
            const result = await (0, card_sell_1.sellCollectionCards)(userId, cardIdToSell, 1);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("USER_NOT_FOUND");
            }
        });
        (0, globals_1.it)("devrait retourner SERVER_ERROR si updateById (collection) échoue", async () => {
            const mockUserDoc = {
                _id: userId,
                myCollection: [mockRareCard, mockRareCard],
            };
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockUserDoc));
            // Simulation du crash de la mise à jour de la collection
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.err)("DB_UPDATE_ERROR"));
            const result = await (0, card_sell_1.sellCollectionCards)(userId, cardIdToSell, 1);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("SERVER_ERROR");
            }
        });
        (0, globals_1.it)("devrait retourner SERVER_ERROR si updateMoneyById (argent) échoue", async () => {
            const mockUserDoc = {
                _id: userId,
                myCollection: [mockRareCard, mockRareCard],
            };
            globals_1.jest.mocked(userMethods.findByIdWithCollection).mockResolvedValue((0, Result_1.ok)(mockUserDoc));
            globals_1.jest.mocked(userMethods.updateById).mockResolvedValue((0, Result_1.ok)({}));
            // Simulation du crash du portefeuille
            globals_1.jest.mocked(userMoneyMethods.updateMoneyById).mockResolvedValue((0, Result_1.err)("MONEY_ERROR"));
            const result = await (0, card_sell_1.sellCollectionCards)(userId, cardIdToSell, 1);
            (0, globals_1.expect)(result.ok).toBe(false);
            if (!result.ok) {
                (0, globals_1.expect)(result.error).toBe("SERVER_ERROR");
            }
        });
    });
});
//# sourceMappingURL=cardSell.service.test.js.map