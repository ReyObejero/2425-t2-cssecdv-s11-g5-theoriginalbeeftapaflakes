import { z } from 'zod';
import { errorMessages, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '@/constants';

export const loginSchema = z.object({
    body: z.object({
        username: z.string({ message: errorMessages.USERNAME_INVALID }),
        password: z.string({ message: errorMessages.PASSWORD_INVALID }),
    }),
});

export const registerSchema = z.object({
    body: z.object({
        username: z
            .string({ message: errorMessages.USERNAME_INVALID })
            .min(MIN_USERNAME_LENGTH, { message: errorMessages.PASSWORD_TOO_SHORT }),
        email: z.string({ message: errorMessages.EMAIL_INVALID }).email({ message: errorMessages.EMAIL_INVALID }),
        password: z
            .string({ message: errorMessages.PASSWORD_INVALID })
            .min(MIN_PASSWORD_LENGTH, { message: errorMessages.PASSWORD_TOO_SHORT }),
    }),
});
