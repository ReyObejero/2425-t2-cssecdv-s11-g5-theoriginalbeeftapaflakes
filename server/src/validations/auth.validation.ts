import { z } from 'zod';
import { errorMessages, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '@/constants';

export const authenticationSchema = z.object({
    body: z.object({
        username: z.string({ message: errorMessages.INVALID_CREDENTIALS }),
        password: z.string({ message: errorMessages.INVALID_CREDENTIALS }),
    }),
});

/**
 * @remarks
 *
 * This schema enforces the password complexity and length standards outlined in the DLSU
 * Active Directory (AD) with some modifications. The specific requirements are listed below:
 * - Minimum length should be at least 8
 * - Number of special characters to include 1
 * - Must contain at least 1 upper case character(s)
 * - Number of numerals to include 1
 * - Must contain at least 1 lower case character(s)
 *
 *
 * Password regex is adopted from: {@link https://stackoverflow.com/a/21456918}
 */
export const registerSchema = z.object({
    body: z.object({
        username: z
            .string({ message: errorMessages.INVALID_INPUT })
            .min(MIN_USERNAME_LENGTH, { message: errorMessages.INVALID_INPUT }),
        email: z.string({ message: errorMessages.INVALID_INPUT }).email({ message: errorMessages.INVALID_INPUT }),
        password: z
            .string({ message: errorMessages.INVALID_INPUT })
            .min(MIN_PASSWORD_LENGTH, { message: errorMessages.INVALID_INPUT })
            .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'), {
                message: errorMessages.INVALID_INPUT,
            }),
    }),
});
