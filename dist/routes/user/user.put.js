"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/user.ts
const express_1 = require("express");
const index_1 = require("../../services/profile/index");
const deck_1 = require("../../services/deck");
const jwt_middleware_1 = require("../../middleware/jwt.middleware");
const user_schema_1 = require("../schemas/user.schema");
const booster_add_1 = require("../../services/booster/booster.add");
const deck_schema_1 = require("../schemas/deck.schema");
const router = (0, express_1.Router)();
router.put("/me/profile", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const body = user_schema_1.UpdateUserSchema.safeParse(req.body);
    if (!body.success) {
        return res.status(400).json({ error: body.error });
    }
    if (Object.keys(body.data).length === 0) {
        return res.status(400).json({ error: "No fields to update provided." });
    }
    const result = await (0, index_1.updateUser)(userId, body.data);
    if (!result.ok) {
        if (result.error === "USER_NOT_FOUND")
            return res.status(404).json({ error: result.error });
        return res.status(400).json({ error: result.error });
    }
    return res.json(result.value);
});
router.put("/me/decks/:deckId", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const { deckId } = req.params;
    if (!deckId || typeof deckId !== "string")
        return res.status(400).json({ error: "MISSING_DECK_ID" });
    const body = deck_schema_1.UpdateDeckSchema.safeParse(req.body);
    if (!body.success)
        return res.status(400).json({ error: "INPUT_INVALID" });
    const result = await (0, deck_1.updateDeck)(userId, deckId, body.data);
    if (!result.ok) {
        if (["DECK_NOT_FOUND", "USER_NOT_FOUND"].includes(result.error))
            return res.status(404).json({ error: result.error });
        if (result.error === "UNAUTHORIZED_DECK")
            return res.status(403).json({ error: result.error });
        return res.status(400).json({ error: result.error });
    }
    return res.json(result.value);
});
router.put("/me/decks/:deckId/active", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const { deckId } = req.params;
    if (!deckId || typeof deckId !== "string")
        return res.status(400).json({ error: "MISSING_DECK_ID" });
    const result = await (0, deck_1.activateDeck)(userId, deckId);
    if (!result.ok) {
        if (["DECK_NOT_FOUND", "USER_NOT_FOUND"].includes(result.error))
            return res.status(404).json({ error: result.error });
        if (result.error === "UNAUTHORIZED_DECK")
            return res.status(403).json({ error: result.error });
        return res.status(400).json({ error: result.error });
    }
    return res.json({ success: true });
});
router.put("/me/boosters/:boosterId", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const boosterId = req.params.boosterId;
    const result = await (0, booster_add_1.addBooster)(userId, boosterId);
    if (!result.ok) {
        if (result.error === "USER_NOT_FOUND")
            return res.status(404).json({ error: result.error });
        if (result.error === "BOOSTER_NOT_FOUND")
            return res.status(404).json({ error: result.error });
        if (result.error === "NOT_ENOUGH_MONEY")
            return res.status(400).json({ error: result.error });
        return res.status(500).json({ error: result.error });
    }
    return res.status(200).json({ success: true, money: result.value.money });
});
router.put("/me/countdownends", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const { countdownends } = req.body;
    if (countdownends === undefined || typeof countdownends !== "string") {
        return res.status(400).json({ error: "INVALID_COUNTDOWNENDS" });
    }
    const dateObject = new Date(countdownends);
    if (isNaN(dateObject.getTime())) {
        return res.status(400).json({ error: "INVALID_COUNTDOWNENDS" });
    }
    // 4. On passe l'objet Date à la fonction
    const result = await (0, index_1.updateCountdown)(userId, dateObject);
    if (!result.ok) {
        if (result.error === "USER_NOT_FOUND")
            return res.status(404).json({ error: result.error });
        return res.status(500).json({ error: result.error });
    }
    return res.json({ countdownEnds: result.value });
});
exports.default = router;
//# sourceMappingURL=user.put.js.map