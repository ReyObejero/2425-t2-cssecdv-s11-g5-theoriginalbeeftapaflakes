import { type User } from '@prisma/client';
import { hash, verify } from 'argon2';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { logger } from '@/config';

const PASSWORD_RESET_TIMEOUT_SECONDS = 86400;

export const userService = {
    getUserByEmail: async (email: string): Promise<User | null> => {
        if (!email) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.INVALID_INPUT);
        }

        return await prismaClient.user.findUnique({
            where: { email },
        });
    },

    getUserById: async (userId: number): Promise<User | null> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        return await prismaClient.user.findUnique({
            where: { id: userId },
        });
    },

    getUserByUsername: async (username: string): Promise<User | null> => {
        if (!username) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.INVALID_INPUT);
        }

        return await prismaClient.user.findUnique({
            where: { username },
        });
    },

    getUsers: async (): Promise<User[]> => {
        return await prismaClient.user.findMany();
    },

    resetPassword: async (userId: number, newPassword: string, securityAnswer: string): Promise<User> => {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            include: { passwordHistories: true },
        });

        if (!user || !newPassword || !securityAnswer) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.INVALID_INPUT);
        }

        if (securityAnswer.trim().toLowerCase() !== user.securityQuestionAnswer.trim().toLowerCase()) {
            throw createError(statusCodes.clientError.UNAUTHORIZED, 'Security answer is incorrect.');
        }

        const currentTime = new Date();
        const passwordResetTimeout = PASSWORD_RESET_TIMEOUT_SECONDS * 1000;

        if (user.passwordChangedAt) {
            const timeDifference = currentTime.getTime() - user.passwordChangedAt.getTime();
            if (timeDifference < passwordResetTimeout) {
                throw createError(statusCodes.clientError.FORBIDDEN, 'Password reset too frequent.');
            }
        }

        const currentPasswordMatches = await verify(user.password, newPassword);
        if (currentPasswordMatches) {
            throw createError(
                statusCodes.clientError.FORBIDDEN,
                'New password cannot be the same as the current password.',
            );
        }

        for (const past of user.passwordHistories) {
            const reused = await verify(past.hash, newPassword);
            if (reused) {
                throw createError(statusCodes.clientError.FORBIDDEN, 'You cannot reuse a previous password.');
            }
        }

        const hashedNewPassword = await hash(newPassword);
        await prismaClient.passwordHistory.create({
            data: {
                userId: user.id,
                hash: user.password,
            },
        });

        const updatedUser = await prismaClient.user.update({
            where: { id: user.id },
            data: {
                password: hashedNewPassword,
                passwordChangedAt: currentTime,
            },
        });

        logger.info(`resetPassword: Password reset successful for user ID ${user.id}.`);
        return updatedUser;
    },

    updateUserAddress: async (username: string, address: string): Promise<User> => {
        if (!username || !(await userService.getUserByUsername(username))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USERNAME_INVALID);
        }

        if (!address) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ADDRESS_INVALID);
        }

        return await prismaClient.user.update({ where: { username }, data: { address } });
    },
};
