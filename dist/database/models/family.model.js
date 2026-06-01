"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilyModel = void 0;
const mongoose_1 = require("mongoose");
const familySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    bonus: {
        ATK: { type: Number, required: true, default: 0 },
        PV: { type: Number, required: true, default: 0 },
    },
});
exports.FamilyModel = (0, mongoose_1.model)("Family", familySchema);
//# sourceMappingURL=family.model.js.map