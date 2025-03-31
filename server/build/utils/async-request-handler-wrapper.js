"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncRequestHandlerWrapper = void 0;
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
const asyncRequestHandlerWrapper = (asyncRequestHandler) => (req, res, next) => asyncRequestHandler(req, res, next).catch(next);
exports.asyncRequestHandlerWrapper = asyncRequestHandlerWrapper;
//# sourceMappingURL=async-request-handler-wrapper.js.map