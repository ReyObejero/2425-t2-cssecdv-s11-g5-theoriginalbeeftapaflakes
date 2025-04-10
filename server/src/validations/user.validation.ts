import { z } from 'zod';
import { errorMessages, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '@/constants';

export const resetPasswordSchema = z.object({
    body: z.object({
        password: z
            .string({ message: errorMessages.INVALID_INPUT })
            .min(MIN_PASSWORD_LENGTH, { message: errorMessages.INVALID_INPUT })
            .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'), {
                message: errorMessages.INVALID_INPUT,
            }),
    }),
});
