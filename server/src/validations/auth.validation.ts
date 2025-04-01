import { z } from 'zod';
import { errorMessages, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '@/constants';

export const loginSchema = z.object({
    body: z.object({
        username: z.string({ message: errorMessages.INVALID_CREDENTIALS }),
        password: z.string({ message: errorMessages.INVALID_CREDENTIALS }),
    }),
});

export const registerSchema = z.object({
    body: z.object({
        username: z
            .string({ message: errorMessages.INVALID_INPUT })
            .min(MIN_USERNAME_LENGTH, { message: errorMessages.INVALID_INPUT }),
        email: z.string({ message: errorMessages.INVALID_INPUT }).email({ message: errorMessages.INVALID_INPUT }),
        password: z
            .string({ message: errorMessages.INVALID_INPUT })
            .min(MIN_PASSWORD_LENGTH, { message: errorMessages.INVALID_INPUT }),
    }),
});
