"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booster_fetch_1 = require("../../services/booster/booster.fetch");
const jwt_middleware_1 = require("../../middleware/jwt.middleware");
const router = (0, express_1.Router)();
router.get("/", jwt_middleware_1.jwtMiddleware, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    const result = await (0, booster_fetch_1.fetchBoosters)();
    if (!result.ok) {
        return res.status(404).json({ error: result.error });
    }
    return res.json(result.value);
});
exports.default = router;
//# sourceMappingURL=booster.get.js.map