import { z } from 'zod';
import { errorMessages, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '@/constants';

export const resetPasswordSchema = z.object({
    body: z.object({
        password: z
            .string({ message: errorMessages.INVALID_INPUT })
            .min(MIN_PASSWORD_LENGTH, { message: errorMessages.INVALID_INPUT })
            .regex(new RegExp('^(?=[A-Za-z])(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=(?:.*[^A-Za-z0-9]){2,})(?!.*(.)\\1\\1).{15,}$'), {
                message: errorMessages.INVALID_INPUT,
            }),
    }),
});
