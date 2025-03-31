"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartItemSchema = exports.updateCartItemSchema = exports.createCartItemSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.createCartItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.number({ message: constants_1.errorMessages.PRODUCT_ID_INVALID }),
        packageId: zod_1.z.number({ message: constants_1.errorMessages.PACKAGE_ID_INVALID }),
        quantity: zod_1.z
            .number({ message: constants_1.errorMessages.QUANTITY_INVALID })
            .refine((quantity) => quantity > 0, { message: constants_1.errorMessages.QUANTITY_INVALID }),
    }),
});
exports.updateCartItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        cartItemId: zod_1.z
            .string({ message: constants_1.errorMessages.CART_ITEM_ID_INVALID })
            .transform((cartItemId) => Number(cartItemId))
            .refine((cartItemId) => !isNaN(cartItemId), { message: constants_1.errorMessages.CART_ITEM_ID_INVALID }),
    }),
    body: zod_1.z.object({
        quantity: zod_1.z
            .number({ message: constants_1.errorMessages.QUANTITY_INVALID })
            .refine((quantity) => quantity > 0, { message: constants_1.errorMessages.QUANTITY_INVALID }),
    }),
});
exports.deleteCartItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        cartItemId: zod_1.z
            .string({ message: constants_1.errorMessages.CART_ITEM_ID_INVALID })
            .transform((cartItemId) => Number(cartItemId))
            .refine((cartItemId) => !isNaN(cartItemId), { message: constants_1.errorMessages.CART_ID_INVALID }),
    }),
});
//# sourceMappingURL=cart.validation.js.map