import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';
import { type AnyZodObject } from 'zod';
import { statusCodes } from '@/constants';
import createError from 'http-errors';
import { logger } from '@/config';

/**
 * Validates the request object against a provided Zod schema.
 *
 * @param schema - The Zod schema to validate against
 * @returns A middleware function that validates the request
 */
export const validate =
    (schema: AnyZodObject): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.safeParse(req);

        if (error) {
            const errors = error?.issues.map((err) => ({
                message: err.message,
            }));

            const errorMessage = errors.length === 1 ? errors[0].message : { message: errors[0].message, errors };
            logger.warn(`Input validation failed for route ${req.method} ${req.originalUrl}`, {
                error: errorMessage,
                ip: req.ip,
            });

            return next(createError(statusCodes.clientError.BAD_REQUEST, errorMessage));
        }

        return next();
    };
