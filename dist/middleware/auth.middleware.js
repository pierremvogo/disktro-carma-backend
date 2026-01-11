"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(authHeader);
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(403).json({ message: "Invalid token." });
            return;
        }
        req.user = decoded;
        next();
    });
};
exports.AuthMiddleware = AuthMiddleware;
