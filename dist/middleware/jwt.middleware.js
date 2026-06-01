"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = exports.signToken = void 0;
// middleware/jwt.middleware.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
    throw new Error("CRITICAL: Le JWT_SECRET n'est pas défini dans l'environnement !");
}
const signToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: "7d" });
};
exports.signToken = signToken;
const jwtMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "UNAUTHORIZED" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ error: "INVALID_TOKEN" });
    }
};
exports.jwtMiddleware = jwtMiddleware;
//# sourceMappingURL=jwt.middleware.js.map