import { z } from 'zod';
import { errorMessages } from '@/constants';

export const getProductByIdSchema = z.object({
    params: z.object({
        productId: z
            .string()
            .transform((productId) => Number(productId))
            .refine((productId) => !isNaN(productId), { message: errorMessages.PRODUCT_ID_INVALID }),
    }),
});

export const deletePackageSchema = z.object({
    params: z.object({
        productId: z
            .string()
            .transform((productId) => Number(productId))
            .refine((productId) => !isNaN(productId), { message: errorMessages.PRODUCT_ID_INVALID }),
        packageId: z
            .string()
            .transform((packageId) => Number(packageId))
            .refine((packageId) => !isNaN(packageId), { message: errorMessages.PACKAGE_ID_INVALID }),
    }),
});
