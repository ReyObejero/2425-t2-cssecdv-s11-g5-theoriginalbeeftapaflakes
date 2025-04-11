import { z } from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        name: z.string({ message: 'INVALID_INPUT' }).min(1, { message: 'INVALID_INPUT' }),
        description: z.string({ message: 'INVALID_INPUT' }).min(1, { message: 'INVALID_INPUT' }),
        price: z.number({ message: 'INVALID_INPUT' }).positive(),
        stock: z.number({ message: 'INVALID_INPUT' }).int().positive(),
    }),
});

export const updateProductSchema = z.object({
    params: z.object({
        productId: z
            .string()
            .transform((val) => Number(val))
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: 'INVALID_INPUT',
            }),
    }),
    body: z.object({
        name: z
            .string({ message: 'INVALID_INPUT' })
            .optional()
            .refine((val) => val === undefined || val.length > 0, {
                message: 'INVALID_INPUT',
            }),
        description: z
            .string({ message: 'INVALID_INPUT' })
            .optional()
            .refine((val) => val === undefined || val.length > 0, {
                message: 'INVALID_INPUT',
            }),
        price: z
            .number({ message: 'INVALID_INPUT' })
            .optional()
            .refine((val) => val === undefined || val > 0, { message: 'INVALID_INPUT' }),
        stock: z
            .number({ message: 'INVALID_INPUT' })
            .optional()
            .refine((val) => val === undefined || (Number.isInteger(val) && val > 0), {
                message: 'INVALID_INPUT',
            }),
    }),
});

export const getProductByIdSchema = z.object({
    params: z.object({
        productId: z
            .string()
            .transform((val) => Number(val))
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: 'INVALID_INPUT',
            }),
    }),
});

export const deletePackageSchema = z.object({
    params: z.object({
        productId: z
            .string()
            .transform((val) => Number(val))
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: 'INVALID_INPUT',
            }),
        packageId: z
            .string()
            .transform((val) => Number(val))
            .refine((val) => Number.isInteger(val) && val > 0, {
                message: 'INVALID_INPUT',
            }),
    }),
});
