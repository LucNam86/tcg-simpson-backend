"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = void 0;
const Result_1 = require("../../../../shared/Result");
const user_model_1 = require("../../../models/user.model");
const save = async (user) => {
    console.log("SAVE USER CALLED", user);
    try {
        const doc = await user_model_1.UserModel.create(user);
        return (0, Result_1.ok)(doc._id.toString());
    }
    catch (e) {
        if (e instanceof Error) {
            console.error("saveUser error:", e.message);
        }
        else {
            console.error("saveUser error unknown:", e);
        }
        return (0, Result_1.err)("Erreur lors de la sauvegarde");
    }
};
exports.save = save;
//# sourceMappingURL=user.save.js.map