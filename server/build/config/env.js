"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, '../../.env') });
(0, dotenv_1.config)({
    path: path_1.default.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
});
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']),
    server: zod_1.z.object({
        PORT: zod_1.z.coerce.number().default(3000),
        HOSTNAME: zod_1.z.string().default('localhost'),
    }),
    cors: zod_1.z.object({
        CORS_ORIGIN: zod_1.z.string(),
    }),
    database: zod_1.z.object({
        DATABASE_URL: zod_1.z.string(),
        DIRECT_URL: zod_1.z.string(),
    }),
    jwt: zod_1.z.object({
        ACCESS_TOKEN_SECRET: zod_1.z.string(),
        ACCESS_TOKEN_EXPIRE_TIME: zod_1.z.string(),
        ACCESS_TOKEN_COOKIE_NAME: zod_1.z.string(),
        REFRESH_TOKEN_SECRET: zod_1.z.string(),
        REFRESH_TOKEN_EXPIRE_TIME: zod_1.z.string(),
        REFRESH_TOKEN_COOKIE_NAME: zod_1.z.string(),
    }),
    cloudinary: zod_1.z.object({
        CLOUD_NAME: zod_1.z.string(),
        API_KEY: zod_1.z.string(),
        API_SECRET: zod_1.z.string(),
    }),
    paypal: zod_1.z.object({
        SANDBOX_BASE_URL: zod_1.z.string(),
        LIVE_BASE_URL: zod_1.z.string(),
        CLIENT_ID: zod_1.z.string(),
        CLIENT_SECRET: zod_1.z.string(),
    }),
});
exports.env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    server: {
        PORT: process.env.PORT,
        HOSTNAME: process.env.HOSTNAME,
    },
    cors: {
        CORS_ORIGIN: process.env.CORS_ORIGIN,
    },
    database: {
        DATABASE_URL: process.env.DATABASE_URL,
        DIRECT_URL: process.env.DIRECT_URL,
    },
    jwt: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRE_TIME: process.env.ACCESS_TOKEN_EXPIRE_TIME,
        ACCESS_TOKEN_COOKIE_NAME: process.env.ACCESS_TOKEN_COOKIE_NAME,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        REFRESH_TOKEN_EXPIRE_TIME: process.env.REFRESH_TOKEN_EXPIRE_TIME,
        REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME,
    },
    cloudinary: {
        CLOUD_NAME: process.env.CLOUD_NAME,
        API_KEY: process.env.API_KEY,
        API_SECRET: process.env.API_SECRET,
    },
    paypal: {
        SANDBOX_BASE_URL: process.env.SANDBOX_BASE_URL,
        LIVE_BASE_URL: process.env.LIVE_BASE_URL,
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
    },
});
//# sourceMappingURL=env.js.map