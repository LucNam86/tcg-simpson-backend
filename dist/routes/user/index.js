"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_post_1 = __importDefault(require("./user.post"));
const user_get_1 = __importDefault(require("./user.get"));
const user_put_1 = __importDefault(require("./user.put"));
const user_delete_1 = __importDefault(require("./user.delete"));
const router = (0, express_1.Router)();
router.use(user_post_1.default);
router.use(user_get_1.default);
router.use(user_put_1.default);
router.use(user_delete_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map