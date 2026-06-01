"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/user.ts
const express_1 = require("express");
const index_1 = require("../../services/profile/index");
const booster_1 = require("../../services/booster");
const deck_1 = require("../../services/deck");
const friends_1 = require("../../services/friends");
const card_1 = require("../../services/card");
const jwt_middleware_1 = require("../../middleware/jwt.middleware");
const router = (0, express_1.Router)();
router.get("/me/profile", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const result = await (0, index_1.fetchUserById)(userId);
    if (!result.ok) {
        return res.status(404).json({ error: result.error });
    }
    return res.json(result.value);
});
router.get("/me/boosters", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const result = await (0, booster_1.fetchUserBoosters)(userId);
    if (!result.ok)
        return res.status(404).json({ error: result.error });
    return res.json(result.value);
});
router.get("/me/collection", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const { q, rarity, type, serie } = req.query;
    const toArray = (val) => {
        if (!val)
            return [];
        if (Array.isArray(val))
            return val;
        return [val];
    };
    const result = await (0, card_1.fetchUserCollection)(userId, {
        q: q,
        rarity: toArray(rarity),
        type: toArray(type),
        serie: toArray(serie),
    });
    if (!result.ok)
        return res.status(404).json({ error: result.error });
    return res.json(result.value);
});
router.get("/me/friends", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const result = await (0, friends_1.fetchUserFriends)(userId);
    if (!result.ok)
        return res.status(404).json({ error: result.error });
    return res.json(result.value);
});
router.get("/search", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const { q } = req.query;
    if (!q || typeof q !== "string")
        return res.json([]);
    const result = await (0, index_1.fetchPseudosAutocomplete)(q, userId);
    if (!result.ok)
        return res.status(500).json({ error: result.error });
    return res.json(result.value);
});
router.get("/me/decks", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const result = await (0, deck_1.fetchUserDecks)(userId);
    if (!result.ok) {
        if (result.error === "USER_NOT_FOUND") {
            return res.status(404).json({ error: result.error });
        }
        return res.status(500).json({ error: "SERVER_ERROR" });
    }
    return res.json(result.value);
});
exports.default = router;
//# sourceMappingURL=user.get.js.map