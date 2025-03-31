import { type User, type UserRole } from '@prisma/client';
import { hash, verify } from 'argon2';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { generateAccessToken, generateRefreshToken } from '@/utils';
import { tokenService } from './token.service';
import { userService } from './user.service';

interface LoginInput {
    username: string;
    password: string;
}

interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

export const authService = {
    register: async (input: RegisterInput, role?: UserRole): Promise<User> => {
        const { username, email, password } = input;

        if (!username) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USERNAME_INVALID);
        }

        if (!email) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.EMAIL_INVALID);
        }

        if (!password) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USERNAME_INVALID);
        }

        if (await userService.getUserByUsername(username)) {
            throw createError(statusCodes.clientError.CONFLICT, errorMessages.USERNAME_ALREADY_IN_USE);
        }

        if (await userService.getUserByEmail(email)) {
            throw createError(statusCodes.clientError.CONFLICT, errorMessages.EMAIL_ALREADY_IN_USE);
        }

        return await prismaClient.user.create({
            data: {
                username,
                email,
                password: await hash(password),
                profilePhotoUrl: 'https://asset.cloudinary.com/dqfjotjba/387e2481f384f9748dd285b3d059c92c',
                ...(role && role !== 'USER' && { role }),
            },
        });
    },

    login: async (
        input: LoginInput,
        refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
        const { username, password } = input;

        if (!username) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USERNAME_INVALID);
        }

        if (!password) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PASSWORD_INVALID);
        }

        const user = await userService.getUserByUsername(username);
        if (!user) {
            throw createError(statusCodes.clientError.NOT_FOUND, errorMessages.USERNAME_INVALID);
        }

        if (!(await verify(user.password, password))) {
            throw createError(statusCodes.clientError.UNAUTHORIZED, errorMessages.PASSWORD_INVALID);
        }

        if (refreshToken) {
            const existingRefreshToken = await tokenService.getRefreshTokenByToken(refreshToken);
            if (!existingRefreshToken || existingRefreshToken.userId != user.id) {
                await tokenService.deleteRefreshTokensByUserId(user.id);
            } else {
                await tokenService.deleteRefreshTokenByToken(existingRefreshToken.token);
            }
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const newRefreshToken = generateRefreshToken(user.id, user.role);
        await tokenService.createRefreshToken(user.id, newRefreshToken);

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user,
        };
    },

    logout: async (userId: number): Promise<User> => {
        if (!userId) {
            throw createError(statusCodes.clientError.NOT_FOUND, errorMessages.USER_ID_INVALID);
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            throw createError(statusCodes.clientError.NOT_FOUND, errorMessages.USER_ID_INVALID);
        }

        await tokenService.deleteRefreshTokensByUserId(userId);

        return user;
    },
};
