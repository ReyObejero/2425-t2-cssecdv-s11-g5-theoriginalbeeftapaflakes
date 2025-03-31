import { OrderStatus } from '@prisma/client';
import { z } from 'zod';
import { errorMessages } from '@/constants';

export const getSalesSchema = z.object({
    query: z
        .object({
            productId: z
                .string()
                .transform((productId) => Number(productId))
                .refine((productId) => !isNaN(productId), { message: errorMessages.PRODUCT_ID_INVALID })
                .optional(),
            packageId: z
                .string()
                .transform((packageId) => Number(packageId))
                .refine((packageId) => !isNaN(packageId), { message: errorMessages.PACKAGE_ID_INVALID })
                .optional(),
            orderStatus: z.nativeEnum(OrderStatus, { message: errorMessages.ORDER_STATUS_INVALID }).optional(),
            startDate: z
                .string()
                .transform((startDate) => new Date(startDate))
                .refine((startDate) => !isNaN(startDate.getTime()), { message: errorMessages.DATE_INVALID })
                .optional(),
            endDate: z
                .string()
                .transform((endDate) => new Date(endDate))
                .refine((endDate) => !isNaN(endDate.getTime()), { message: errorMessages.DATE_INVALID })
                .optional(),
        })
        .refine(
            (query) => {
                if (query.startDate && query.endDate) {
                    return new Date(query.startDate) <= new Date(query.endDate);
                }
                return true;
            },
            { message: errorMessages.DATE_INVALID },
        ),
});
