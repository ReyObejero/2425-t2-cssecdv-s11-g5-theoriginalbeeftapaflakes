"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const constants_1 = require("../constants");
const http_errors_1 = __importDefault(require("http-errors"));
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
const validate = (schema) => (req, res, next) => {
    const { error } = schema.safeParse(req);
    if (error) {
        const errors = error === null || error === void 0 ? void 0 : error.issues.map((err) => ({
            message: err.message,
        }));
        const errorPayload = errors.length === 1 ? errors[0].message : { message: errors[0].message, errors };
        return next((0, http_errors_1.default)(constants_1.statusCodes.clientError.BAD_REQUEST, errorPayload));
    }
    return next();
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map