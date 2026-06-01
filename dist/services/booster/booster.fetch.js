"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBoosters = fetchBoosters;
const Result_1 = require("../../shared/Result");
const booster_1 = require("../../database/methods/booster");
const booster_mapper_1 = require("../../database/mapper/booster.mapper");
async function fetchBoosters() {
    const result = await (0, booster_1.find)();
    if (!result.ok)
        return (0, Result_1.err)("DATABASE_ERROR");
    if (!result.value)
        return (0, Result_1.err)("UNKNOWN_BOOSTER");
    return (0, Result_1.ok)(result.value.map((booster) => (0, booster_mapper_1.mapBooster)(booster)));
}
//# sourceMappingURL=booster.fetch.js.map