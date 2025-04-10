import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config';
import { errorHandler } from './middlewares';
import { mountRoutes } from './routes';
import { loggerMiddleware } from './middlewares';

const app = express();
app.use(
    cors({
        origin: env.cors.CORS_ORIGIN,
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use(loggerMiddleware);
mountRoutes(app);
app.use(errorHandler);

export { app };
