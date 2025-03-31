import { type User } from '@prisma/client';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';

export const userService = {
    getUserByEmail: async (email: string): Promise<User | null> => {
        if (!email) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.EMAIL_INVALID);
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
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USERNAME_INVALID);
        }

        return await prismaClient.user.findUnique({
            where: { username },
        });
    },

    getUsers: async (): Promise<User[]> => {
        return await prismaClient.user.findMany();
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
