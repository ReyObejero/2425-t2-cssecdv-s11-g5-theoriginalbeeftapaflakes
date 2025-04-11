import { OrderStatus } from '@prisma/client';
import { z } from 'zod';
import { errorMessages } from '@/constants';

export const createOrderSchema = z.object({
    body: z.object({
        productId: z.number({ message: errorMessages.PRODUCT_ID_INVALID }).int().positive(),
        packageId: z.number({ message: errorMessages.PACKAGE_ID_INVALID }).int().positive(),
        quantity: z.number({ message: errorMessages.QUANTITY_INVALID }).int().positive(),
        price: z.number({ message: errorMessages.PRICE_INVALID }).positive(),

        cardNumber: z
            .string({ message: errorMessages.CARD_NUMBER_INVALID })
            .regex(/^\d{16}$/, { message: errorMessages.CARD_NUMBER_INVALID }),

        cardExpirationYear: z
            .string({ message: errorMessages.CARD_EXPIRATION_DATE_INVALID })
            .regex(/^\d{4}$/, { message: errorMessages.CARD_EXPIRATION_DATE_INVALID }),

        cardExpirationMonth: z
            .string({ message: errorMessages.CARD_EXPIRATION_DATE_INVALID })
            .regex(/^(0[1-9]|1[0-2])$/, { message: errorMessages.CARD_EXPIRATION_DATE_INVALID }),

        cardSecurityCode: z
            .string({ message: errorMessages.CARD_SECURITY_CODE_INVALID })
            .regex(/^\d{3,4}$/, { message: errorMessages.CARD_SECURITY_CODE_INVALID }),
    }),
});

export const updateOrderStatusSchema = z.object({
    params: z.object({
        orderId: z
            .string()
            .transform((val) => Number(val))
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: errorMessages.ORDER_ID_INVALID,
            }),
    }),
    body: z.object({
        updatedStatus: z.nativeEnum(OrderStatus, {
            message: errorMessages.ORDER_STATUS_INVALID,
        }),
    }),
});
