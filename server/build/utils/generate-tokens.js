"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const generateAccessToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, config_1.env.jwt.ACCESS_TOKEN_SECRET, {
        expiresIn: config_1.env.jwt.ACCESS_TOKEN_EXPIRE_TIME,
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, config_1.env.jwt.REFRESH_TOKEN_SECRET, {
        expiresIn: config_1.env.jwt.REFRESH_TOKEN_EXPIRE_TIME,
    });
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=generate-tokens.js.map