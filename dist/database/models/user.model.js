"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    pseudo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
    passwordHash: { type: String, required: true },
    money: { type: Number, default: 0 },
    countdownEnds: { type: Date, default: "" },
    myCollection: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Card", default: [] }],
    boosters: [
        {
            booster: { type: mongoose_1.Schema.Types.ObjectId, ref: "Booster", required: true },
            number: { type: Number, required: true, default: 1 },
        },
    ],
    decks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Deck", default: [] }],
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: [] }],
    darkMode: { type: Boolean, default: false },
});
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map