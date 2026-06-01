"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_middleware_1 = require("../../middleware/jwt.middleware");
const friends_1 = require("../../services/friends");
const deck_1 = require("../../services/deck");
const router = (0, express_1.Router)();
router.delete("/me/friends/:pseudo", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const { pseudo } = req.params;
    if (!pseudo || typeof pseudo !== "string") {
        return res.status(400).json({ error: "INVALID_OR_MISSING_PSEUDO" });
    }
    const result = await (0, friends_1.removeUserFriendByPseudo)(userId, pseudo);
    if (!result.ok) {
        if (result.error === "USER_NOT_FOUND")
            return res.status(404).json({ error: result.error });
        return res.status(500).json({ error: result.error });
    }
    return res.json({ success: true });
});
router.delete("/me/decks/:deckId", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const { deckId } = req.params;
    if (!deckId || typeof deckId !== "string")
        return res.status(400).json({ error: "MISSING_DECK_ID" });
    const result = await (0, deck_1.removeUserDeck)(userId, deckId);
    if (!result.ok) {
        if (["DECK_NOT_FOUND", "USER_NOT_FOUND"].includes(result.error))
            return res.status(404).json({ error: result.error });
        if (result.error === "UNAUTHORIZED_DECK")
            return res.status(403).json({ error: result.error });
        return res.status(500).json({ error: result.error });
    }
    return res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=user.delete.js.map