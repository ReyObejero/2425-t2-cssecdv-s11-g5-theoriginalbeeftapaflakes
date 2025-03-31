import { config } from 'dotenv';
import path from 'path';
import { z } from 'zod';

config({ path: path.resolve(__dirname, '../../.env') });
config({
    path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    server: z.object({
        PORT: z.coerce.number().default(3000),
        HOSTNAME: z.string().default('localhost'),
    }),
    cors: z.object({
        CORS_ORIGIN: z.string(),
    }),
    database: z.object({
        DATABASE_URL: z.string(),
        DIRECT_URL: z.string(),
    }),
    jwt: z.object({
        ACCESS_TOKEN_SECRET: z.string(),
        ACCESS_TOKEN_EXPIRE_TIME: z.string(),
        ACCESS_TOKEN_COOKIE_NAME: z.string(),
        REFRESH_TOKEN_SECRET: z.string(),
        REFRESH_TOKEN_EXPIRE_TIME: z.string(),
        REFRESH_TOKEN_COOKIE_NAME: z.string(),
    }),
    cloudinary: z.object({
        CLOUD_NAME: z.string(),
        API_KEY: z.string(),
        API_SECRET: z.string(),
    }),
    paypal: z.object({
        SANDBOX_BASE_URL: z.string(),
        LIVE_BASE_URL: z.string(),
        CLIENT_ID: z.string(),
        CLIENT_SECRET: z.string(),
    }),
});

export const env = envSchema.parse({
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
