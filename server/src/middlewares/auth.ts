import { RequestHandler, type NextFunction, type Request, type Response } from 'express';
import createError from 'http-errors';
import { verify, type JwtPayload, type VerifyErrors } from 'jsonwebtoken';
import { env } from '@/config';
import { errorMessages, statusCodes } from '@/constants';
import { getTokenFromHeader } from '@/utils';
import { logger } from '@/config';
import { UserRole } from '@prisma/client';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const accessToken = getTokenFromHeader(req.headers['authorization']);
    if (!accessToken) {
        logger.warn(`Authentication failed: [IP: ${req.ip}]`);
        return next(createError(statusCodes.clientError.UNAUTHORIZED, errorMessages.TOKEN_NOT_FOUND));
    }

    verify(
        accessToken,
        env.jwt.ACCESS_TOKEN_SECRET,
        (error: VerifyErrors | null, payload: JwtPayload | string | undefined): void => {
            if (error || !payload || typeof payload === 'string') {
                logger.warn(`Authentication failed: [IP: ${req.ip}]`);
                return next(createError(statusCodes.clientError.UNAUTHORIZED, errorMessages.TOKEN_INVALID));
            }

            req.jwtPayload = {
                userId: payload.userId,
                role: payload.role,
                exp: payload.exp,
            };

            logger.info(`Authentication successful for user ID: ${payload.userId} [IP: ${req.ip}]`);
            return next();
        },
    );
};

export const protect =
    (role: UserRole): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): void => {
        if (req.jwtPayload?.role !== role) {
            logger.warn(
                `Access control failure: User ID ${req.jwtPayload?.userId} tried to access ${req.originalUrl} with insufficient role [IP: ${req.ip}]`,
            );
            return next(createError(statusCodes.clientError.FORBIDDEN, errorMessages.ACCESS_DENIED));
        }

        return next();
    };
