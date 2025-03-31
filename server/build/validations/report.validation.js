"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.getSalesSchema = zod_1.z.object({
    query: zod_1.z
        .object({
        productId: zod_1.z
            .string()
            .transform((productId) => Number(productId))
            .refine((productId) => !isNaN(productId), { message: constants_1.errorMessages.PRODUCT_ID_INVALID })
            .optional(),
        packageId: zod_1.z
            .string()
            .transform((packageId) => Number(packageId))
            .refine((packageId) => !isNaN(packageId), { message: constants_1.errorMessages.PACKAGE_ID_INVALID })
            .optional(),
        orderStatus: zod_1.z.nativeEnum(client_1.OrderStatus, { message: constants_1.errorMessages.ORDER_STATUS_INVALID }).optional(),
        startDate: zod_1.z
            .string()
            .transform((startDate) => new Date(startDate))
            .refine((startDate) => !isNaN(startDate.getTime()), { message: constants_1.errorMessages.DATE_INVALID })
            .optional(),
        endDate: zod_1.z
            .string()
            .transform((endDate) => new Date(endDate))
            .refine((endDate) => !isNaN(endDate.getTime()), { message: constants_1.errorMessages.DATE_INVALID })
            .optional(),
    })
        .refine((query) => {
        if (query.startDate && query.endDate) {
            return new Date(query.startDate) <= new Date(query.endDate);
        }
        return true;
    }, { message: constants_1.errorMessages.DATE_INVALID }),
});
//# sourceMappingURL=report.validation.js.map