"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerieModel = void 0;
// serie.model.ts
const mongoose_1 = require("mongoose");
const serieSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    total: { type: Number, required: true, default: 40 },
}, { toObject: { virtuals: true }, toJSON: { virtuals: true } });
exports.SerieModel = (0, mongoose_1.model)("Serie", serieSchema);
//# sourceMappingURL=serie.model.js.map