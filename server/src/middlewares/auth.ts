import { type NextFunction, type Request, type Response } from 'express';
import createError from 'http-errors';
import { verify, type JwtPayload, type VerifyErrors } from 'jsonwebtoken';
import { env } from '@/config';
import { errorMessages, statusCodes } from '@/constants';

/**
 * Middleware function to authenticate the user with the JWT access token in the HTTP cookies. It verifies the token and
 * extracts the payload, which is then attached to the `req` object under the `jwtPayload` property. If the token is not
 * found or is invalid, control is passed to the `next` function with an appropriate error.
 *
 * @example
 * ```
 * import { authenticate } from '/path/to/verify-auth';
 *
 * app.post('/some-endpoint', authenticate, async (req, res) => {
 *     // Some action...
 * });
 * ```
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const accessToken = req.cookies[env.jwt.ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
        return next(
            createError(
                statusCodes.clientError.UNAUTHORIZED,
                accessToken === undefined ? errorMessages.TOKEN_NOT_FOUND : errorMessages.TOKEN_INVALID,
            ),
        );
    }

    verify(
        accessToken,
        env.jwt.ACCESS_TOKEN_SECRET,
        (error: VerifyErrors | null, payload: JwtPayload | string | undefined): void => {
            if (error || !payload || typeof payload === 'string') {
                return next(createError(statusCodes.clientError.UNAUTHORIZED, errorMessages.TOKEN_INVALID));
            }

            req.jwtPayload = {
                userId: payload.userId,
                role: payload.role,
                exp: payload.exp,
            };

            return next();
        },
    );
};

/**
 * Middleware function to protect routes against non-admin access with the `role` property in `req.jwtPayload`.
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
export const protect = (req: Request, res: Response, next: NextFunction): void => {
    if (req.jwtPayload?.role !== 'ADMIN') {
        next(createError(statusCodes.clientError.FORBIDDEN, errorMessages.ACCESS_DENIED));
    }

    return next();
};
