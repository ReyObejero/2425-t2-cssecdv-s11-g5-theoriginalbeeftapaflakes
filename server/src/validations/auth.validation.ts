import { z } from 'zod';
import { errorMessages, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '@/constants';

export const loginSchema = z.object({
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
 * - Minimum length should be at least 15
 * - Must start with a letter
 * - Must contain at least 1 upper case character(s)
 * - Number of numerals to include 1
 * - Must contain at least 1 lower case character(s)
 * - Number of special characters to include 2
 * - Must not contain any character more than 2 times consecutively
 *
 * Password regex is adapted from DLSU's Active Directory
 */
export const registerSchema = z.object({
    body: z.object({
        email: z.string({ message: errorMessages.INVALID_INPUT }).email({ message: errorMessages.INVALID_INPUT }),
        username: z
            .string({ message: errorMessages.INVALID_INPUT })
            .min(MIN_USERNAME_LENGTH, { message: errorMessages.INVALID_INPUT }),
        password: z
            .string({ message: errorMessages.INVALID_INPUT })
            .regex(/^(?=[A-Za-z])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=(?:.*[^A-Za-z0-9]){2,})(?!.*(.)\1\1).{15,}$/, {
                message: errorMessages.INVALID_INPUT,
            }),
        securityAnswer: z
            .string({ message: errorMessages.INVALID_INPUT })
            .min(1, { message: 'Password reset question answer is required' }),
    }),
});
