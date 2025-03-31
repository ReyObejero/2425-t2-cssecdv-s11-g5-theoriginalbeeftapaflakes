"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.number({ message: constants_1.errorMessages.PRODUCT_ID_INVALID }),
        packageId: zod_1.z.number({ message: constants_1.errorMessages.PACKAGE_ID_INVALID }),
        quantity: zod_1.z.number({ message: constants_1.errorMessages.QUANTITY_INVALID }),
        price: zod_1.z.number({ message: constants_1.errorMessages.PRICE_INVALID }),
        cardNumber: zod_1.z.string({ message: constants_1.errorMessages.CARD_NUMBER_INVALID }),
        cardExpirationYear: zod_1.z.string({ message: constants_1.errorMessages.CARD_EXPIRATION_DATE_INVALID }),
        cardExpirationMonth: zod_1.z.string({ message: constants_1.errorMessages.CARD_EXPIRATION_DATE_INVALID }),
        cardSecurityCode: zod_1.z.string({ message: constants_1.errorMessages.CARD_SECURITY_CODE_INVALID }),
    }),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        orderId: zod_1.z
            .string()
            .transform((orderId) => Number(orderId))
            .refine((orderId) => !isNaN(orderId), { message: constants_1.errorMessages.ORDER_ID_INVALID }),
    }),
    body: zod_1.z.object({
        updatedStatus: zod_1.z.nativeEnum(client_1.OrderStatus, { message: constants_1.errorMessages.ORDER_STATUS_INVALID }),
    }),
});
//# sourceMappingURL=order.validation.js.map