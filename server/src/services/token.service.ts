import { type RefreshToken } from '@prisma/client';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';

export const tokenService = {
    createRefreshToken: async (userId: number, token: string): Promise<RefreshToken> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!token) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.TOKEN_INVALID);
        }

        return await prismaClient.refreshToken.create({ data: { userId, token } });
    },

    deleteRefreshTokensByUserId: async (userId: number): Promise<RefreshToken[]> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        const refreshTokens = await tokenService.getRefreshTokensByUserId(userId);
        await prismaClient.refreshToken.deleteMany({ where: { id: userId } });

        return refreshTokens;
    },

    deleteRefreshTokenByToken: async (token: string): Promise<RefreshToken> => {
        if (!token) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.TOKEN_INVALID);
        }

        if (!(await tokenService.getRefreshTokenByToken(token))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.TOKEN_NOT_FOUND);
        }

        return await prismaClient.refreshToken.delete({ where: { token } });
    },

    getRefreshTokenByToken: async (token: string): Promise<RefreshToken | null> => {
        if (!token) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.TOKEN_INVALID);
        }

        return await prismaClient.refreshToken.findUnique({ where: { token } });
    },

    getRefreshTokensByUserId: async (userId: number): Promise<RefreshToken[]> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        return await prismaClient.refreshToken.findMany({ where: { userId } });
    },
};
