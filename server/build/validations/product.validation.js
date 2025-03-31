"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePackageSchema = exports.getProductByIdSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.getProductByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        productId: zod_1.z
            .string()
            .transform((productId) => Number(productId))
            .refine((productId) => !isNaN(productId), { message: constants_1.errorMessages.PRODUCT_ID_INVALID }),
    }),
});
exports.deletePackageSchema = zod_1.z.object({
    params: zod_1.z.object({
        productId: zod_1.z
            .string()
            .transform((productId) => Number(productId))
            .refine((productId) => !isNaN(productId), { message: constants_1.errorMessages.PRODUCT_ID_INVALID }),
        packageId: zod_1.z
            .string()
            .transform((packageId) => Number(packageId))
            .refine((packageId) => !isNaN(packageId), { message: constants_1.errorMessages.PACKAGE_ID_INVALID }),
    }),
});
//# sourceMappingURL=product.validation.js.map