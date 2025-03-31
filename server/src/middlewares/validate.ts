import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';
import { type AnyZodObject } from 'zod';
import { statusCodes } from '@/constants';
import createError from 'http-errors';

/**
 * Validates the request object against a provided Zod schema.
 *
 * @example
 * ```
 * import { z } from 'zod';
 * import { validate } from '/path/to/validate';
 *
 * const someSchema = z.object({
 *     body: z.object({
 *        someProperty: z.number(),
 *        someOtherProperty: z.string(),
 *     }),
 * });
 *
 * app.post('/some-endpoint', validate(someSchema), async (req, res) => {
 *     // Values are guaranteed to be valid
 *     const someValue = someService.someMethod(req.body);
 *
 *     res.status(201).json({ data: someValue });
 * });
 * ```
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

            const errorPayload = errors.length === 1 ? errors[0].message : { message: errors[0].message, errors };

            return next(createError(statusCodes.clientError.BAD_REQUEST, errorPayload));
        }

        return next();
    };
