import { type Request, type Response, type NextFunction } from 'express';
import { type HttpError } from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { sendResponse } from '@/utils';

/**
 * A middleware function that catches and processes errors.
 *
 * @example
 * ```
 * import { errorHandler } from '/path/to/error-handler';
 *
 * app.use(someMiddleware);
 * // Mount handler after other app.use() and routes calls
 * app.use(errorHandler);
 * ```
 *
 * @param err - The error object to handle
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || statusCodes.serverError.INTERNAL_SERVER_ERROR;
    const errorMessage = err.message || errorMessages.INTERNAL_SERVER_ERROR;
    const errorPayload = { error: { message: errorMessage, ...(err.errors && { errors: err.errors }) } };

    return sendResponse(res, statusCode, errorPayload);
};
