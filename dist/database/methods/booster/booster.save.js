"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveBoosterToUser = saveBoosterToUser;
const Result_1 = require("../../../shared/Result");
const user_model_1 = require("../../models/user.model");
const mongoose_1 = require("mongoose");
async function saveBoosterToUser(userId, boosterId) {
    try {
        const user = await user_model_1.UserModel.findById(userId);
        if (!user)
            return (0, Result_1.err)("USER_NOT_FOUND");
        const existingBooster = user.boosters.find((b) => b.booster.toString() === boosterId);
        if (existingBooster) {
            await user_model_1.UserModel.updateOne({ _id: userId, "boosters.booster": new mongoose_1.Types.ObjectId(boosterId) }, { $inc: { "boosters.$.number": 1 } });
        }
        else {
            await user_model_1.UserModel.updateOne({ _id: userId }, { $push: { boosters: { booster: new mongoose_1.Types.ObjectId(boosterId), number: 1 } } });
        }
        return (0, Result_1.ok)(undefined);
    }
    catch (e) {
        console.error("addBoosterToUser error:", e);
        return (0, Result_1.err)("DATABASE_ERROR");
    }
}
//# sourceMappingURL=booster.save.js.map