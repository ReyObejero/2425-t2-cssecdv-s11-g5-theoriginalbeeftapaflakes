"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = exports.authenticate = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const constants_1 = require("../constants");
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
const authenticate = (req, res, next) => {
    const accessToken = req.cookies[config_1.env.jwt.ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
        return next((0, http_errors_1.default)(constants_1.statusCodes.clientError.UNAUTHORIZED, accessToken === undefined ? constants_1.errorMessages.TOKEN_NOT_FOUND : constants_1.errorMessages.TOKEN_INVALID));
    }
    (0, jsonwebtoken_1.verify)(accessToken, config_1.env.jwt.ACCESS_TOKEN_SECRET, (error, payload) => {
        if (error || !payload || typeof payload === 'string') {
            return next((0, http_errors_1.default)(constants_1.statusCodes.clientError.UNAUTHORIZED, constants_1.errorMessages.TOKEN_INVALID));
        }
        req.jwtPayload = {
            userId: payload.userId,
            role: payload.role,
            exp: payload.exp,
        };
        return next();
    });
};
exports.authenticate = authenticate;
/**
 * Middleware function to protect routes against non-admin access with the `role` property in `req.jwtPayload`.
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
const protect = (req, res, next) => {
    var _a;
    if (((_a = req.jwtPayload) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN') {
        next((0, http_errors_1.default)(constants_1.statusCodes.clientError.FORBIDDEN, constants_1.errorMessages.ACCESS_DENIED));
    }
    return next();
};
exports.protect = protect;
//# sourceMappingURL=auth.js.map