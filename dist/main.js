"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./config/env");
const user_1 = __importDefault(require("./routes/user"));
const card_1 = __importDefault(require("./routes/card"));
const booster_1 = __importDefault(require("./routes/booster"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use('/users', user_1.default);
app.use('/cards', card_1.default);
app.use('/boosters', booster_1.default);
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "TCG Simpson API" });
});
mongoose_1.default.connect(env_1.env.DATABASE_URL).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});
// Pour le dev local
if (process.env.NODE_ENV !== 'production') {
    app.listen(env_1.env.PORT, () => console.log(`API up on :${env_1.env.PORT}`));
}
exports.default = app;
//# sourceMappingURL=main.js.map