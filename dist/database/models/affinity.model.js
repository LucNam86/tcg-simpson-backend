"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffinityModel = void 0;
const mongoose_1 = require("mongoose");
const affinitySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    bonus: {
        ATK: { type: Number, required: true, default: 0 },
        PV: { type: Number, required: true, default: 0 },
    },
});
exports.AffinityModel = (0, mongoose_1.model)("Affinity", affinitySchema);
//# sourceMappingURL=affinity.model.js.map