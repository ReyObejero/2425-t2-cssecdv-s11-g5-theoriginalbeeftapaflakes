"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const constants_1 = require("../constants");
const utils_1 = require("../utils");
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
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const statusCode = err.statusCode || constants_1.statusCodes.serverError.INTERNAL_SERVER_ERROR;
    const errorMessage = err.message || constants_1.errorMessages.INTERNAL_SERVER_ERROR;
    const errorPayload = { error: Object.assign({ message: errorMessage }, (err.errors && { errors: err.errors })) };
    return (0, utils_1.sendResponse)(res, statusCode, errorPayload);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map