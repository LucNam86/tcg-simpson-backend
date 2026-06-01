"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const card_fetch_1 = require("../../services/card/card.fetch");
require("../../database/models/card.model"); //
require("../../database/models/family.model");
require("../../database/models/affinity.model");
require("../../database/models/serie.model");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const { q, rarity, type, serie } = req.query;
    const toArray = (val) => {
        if (!val)
            return [];
        if (Array.isArray(val))
            return val;
        return [val];
    };
    const result = await (0, card_fetch_1.fetchCards)({
        q: q,
        rarity: toArray(rarity),
        type: toArray(type),
        serie: toArray(serie),
    });
    if (!result.ok)
        return res.status(404).json({ error: result.error });
    return res.json(result.value);
});
exports.default = router;
//# sourceMappingURL=card.get.js.map