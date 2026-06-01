"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_schema_1 = require("../schemas/user.schema");
const authentication_1 = require("../../services/authentication");
const friends_add_1 = require("../../services/friends/friends.add");
const deck_1 = require("../../services/deck");
const deck_schema_1 = require("../schemas/deck.schema");
const jwt_middleware_1 = require("../../middleware/jwt.middleware");
const booster_1 = require("../../services/booster");
const card_1 = require("../../services/card");
const profile_1 = require("../../services/profile");
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    console.log("REGISTER ROUTE HIT", req.body);
    const body = user_schema_1.RegisterSchema.safeParse(req.body);
    if (!body.success)
        return res.status(400).json({ error: "EMAIL_INVALID" });
    const result = await (0, authentication_1.registerUser)(body.data);
    if (!result.ok) {
        if (result.error === "EMAIL_TAKEN")
            return res.status(409).json({ error: result.error });
        if (result.error === "PSEUDO_TAKEN")
            return res.status(409).json({ error: result.error });
        return res.status(400).json({ error: result.error });
    }
    const token = (0, jwt_middleware_1.signToken)({ id: result.value.id });
    const { id, ...userWithoutId } = result.value;
    return res.status(201).json({ token, ...userWithoutId });
});
router.post("/connect", async (req, res) => {
    const body = user_schema_1.ConnectSchema.safeParse(req.body);
    if (!body.success)
        return res.status(400).json({ error: "INPUT_INVALID" });
    const result = await (0, authentication_1.connectUser)(body.data);
    if (!result.ok) {
        return res.status(400).json({ error: result.error });
    }
    const token = (0, jwt_middleware_1.signToken)({ id: result.value.id });
    return res.status(201).json({ token, ...result.value });
});
router.post("/me/friends", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const { pseudo } = req.body;
    if (!pseudo)
        return res.status(400).json({ error: "PSEUDO_REQUIRED" });
    const result = await (0, friends_add_1.addUserFriend)(userId, pseudo);
    if (!result.ok) {
        if (result.error === "USER_NOT_FOUND")
            return res.status(404).json({ error: result.error });
        if (result.error === "CANT_ADD_SELF")
            return res.status(400).json({ error: result.error });
        return res.status(500).json({ error: result.error });
    }
    return res.json({ success: true });
});
router.post("/me/decks", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const body = deck_schema_1.CreateDeckSchema.safeParse(req.body);
    if (!body.success)
        return res.status(400).json({ error: "INPUT_INVALID" });
    const result = await (0, deck_1.addDeck)({ userId, name: body.data.name, cards: body.data.cards });
    if (!result.ok) {
        switch (result.error) {
            case "USER_NOT_FOUND":
                return res.status(404).json({ error: result.error });
            case "MAX_DECKS_REACHED":
                return res.status(400).json({ error: result.error });
            default:
                return res.status(500).json({ error: "SERVER_ERROR" });
        }
    }
    return res.status(201).json(result.value);
});
// routes/booster.route.ts
router.post("/me/boosters/:boosterId/open", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const boosterId = req.params.boosterId;
    const result = await (0, booster_1.openBooster)(userId, boosterId);
    if (!result.ok)
        return res.status(404).json({ error: result.error });
    return res.json({ cards: result.value });
});
router.post("/me/collection/sell", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const { cardId, count } = req.body;
    if (!cardId || !count || typeof count !== "number" || count <= 0) {
        return res.status(400).json({ error: "INPUT_INVALID" });
    }
    const result = await (0, card_1.sellCollectionCards)(userId, cardId, count);
    if (!result.ok) {
        switch (result.error) {
            case "USER_NOT_FOUND":
                return res.status(404).json({ error: "USER_NOT_FOUND" });
            case "INSUFFICIENT_QUANTITY":
                return res.status(400).json({ error: "INSUFFICIENT_QUANTITY" });
            case "DATABASE_ERROR":
            case "SERVER_ERROR":
            default:
                return res.status(500).json({ error: "SERVER_ERROR" });
        }
    }
    // On renvoie le succès ainsi que les donuts calculés par le serveur
    return res.json({ success: true, earnedDonuts: result.value.earnedDonuts, money: result.value.money });
});
const MONEY_PACKS = {
    "pack-50": 50,
    "pack-100": 100,
    "pack-200": 200,
    "pack-500": 500,
    "pack-1000": 1000,
};
router.post("/me/money", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const { packId } = req.body;
    if (!packId || !MONEY_PACKS[packId]) {
        return res.status(400).json({ error: "INVALID_PACK" });
    }
    const amount = MONEY_PACKS[packId];
    const result = await (0, profile_1.addMoney)(userId, amount);
    if (!result.ok) {
        if (result.error === "USER_NOT_FOUND")
            return res.status(404).json({ error: result.error });
        return res.status(500).json({ error: result.error });
    }
    return res.json({ money: result.value });
});
router.post("/me/money/daily", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const result = await (0, profile_1.updateDailyMoney)(userId);
    if (!result.ok) {
        if (result.error === "USER_NOT_FOUND")
            return res.status(404).json({ error: result.error });
        if (result.error === "NOT_READY")
            return res.status(400).json({ error: result.error });
        return res.status(500).json({ error: result.error });
    }
    return res.json({ money: result.value.money, countdownEnds: result.value.countdownEnds });
});
exports.default = router;
//# sourceMappingURL=user.post.js.map