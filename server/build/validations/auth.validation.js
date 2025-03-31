"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string({ message: constants_1.errorMessages.USERNAME_INVALID }),
        password: zod_1.z.string({ message: constants_1.errorMessages.PASSWORD_INVALID }),
    }),
});
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z
            .string({ message: constants_1.errorMessages.USERNAME_INVALID })
            .min(constants_1.MIN_USERNAME_LENGTH, { message: constants_1.errorMessages.PASSWORD_TOO_SHORT }),
        email: zod_1.z.string({ message: constants_1.errorMessages.EMAIL_INVALID }).email({ message: constants_1.errorMessages.EMAIL_INVALID }),
        password: zod_1.z
            .string({ message: constants_1.errorMessages.PASSWORD_INVALID })
            .min(constants_1.MIN_PASSWORD_LENGTH, { message: constants_1.errorMessages.PASSWORD_TOO_SHORT }),
    }),
});
//# sourceMappingURL=auth.validation.js.map