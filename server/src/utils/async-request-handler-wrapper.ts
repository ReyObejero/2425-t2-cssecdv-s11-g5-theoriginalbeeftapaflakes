import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Wraps an asynchronous request handler to catch errors without a try...catch statement and forwards the errors to the
 * next middleware for handling.
 *
 * @example
 * Request handler:
 * ```
 * app.get('/some-endpoint', async (req, res, next) => {
 *     try {
 *         const someValue = someService.someMethod();
 *
 *         res.status(200).json({ data: someValue });
 *     } catch (error) {
 *         next(error);
 *     }
 * });
 * ```
 * Wrapped request handler:
 * ```
 * import { asyncRequestHandlerWrapper } from '/path/to/async-request-handler-wrapper';
 *
 * app.get('/some-endpoint', asyncRequestHandlerWrapper(async (req, res) => {
 *     // Errors thrown by the method are propogated to and forward by the
 *     // request handler
 *     const someValue = someService.someMethod();
 *
 *     res.status(200).json({ data: someValue });
 * }));
 * ```
 *
 * @param asyncRequestHandler - The asynchronous request handler to wrap
 * @returns The middleware function that handles the request and catches the errors
 */
export const asyncRequestHandlerWrapper =
    (asyncRequestHandler: AsyncRequestHandler): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): Promise<void> =>
        asyncRequestHandler(req, res, next).catch(next);
