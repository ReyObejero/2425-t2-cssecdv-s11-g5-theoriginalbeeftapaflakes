import { type User } from '@prisma/client';
import { hash, verify } from 'argon2';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { isBefore, subDays } from 'date-fns';
import { logger } from '@/config';

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

        const passwordChangedAt = user.passwordChangedAt;
        if (passwordChangedAt && isBefore(new Date(), subDays(passwordChangedAt, -1))) {
            throw createError(statusCodes.clientError.FORBIDDEN, 'Password reset too frequent.');
        }

        for (const past of user.passwordHistories) {
            const reused = await verify(past.hash, newPassword);
            if (reused) {
                throw createError(statusCodes.clientError.FORBIDDEN, 'You cannot reuse a previous password.');
            }
        }

        const hashedPassword = await hash(newPassword);

        const updatedUser = await prismaClient.$transaction(async (tx) => {
            await tx.passwordHistory.create({
                data: {
                    userId: user.id,
                    hash: user.password,
                },
            });

            return await tx.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    passwordChangedAt: new Date(),
                },
            });
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
