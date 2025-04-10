import { type User, UserRole } from '@prisma/client';
import { hash, verify } from 'argon2';
import createError from 'http-errors';
import { errorMessages, LOGIN_LOCKOUT_DURATION_MINUTES, statusCodes } from '@/constants';
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

        if (
            !username ||
            !email ||
            !password ||
            (await userService.getUserByUsername(username)) ||
            (await userService.getUserByEmail(email))
        ) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.INVALID_INPUT);
        }

        return await prismaClient.user.create({
            data: {
                username,
                email,
                password: await hash(password),
                profilePhotoUrl: 'https://asset.cloudinary.com/dqfjotjba/387e2481f384f9748dd285b3d059c92c',
                ...(role && role !== UserRole.CUSTOMER && { role }),
            },
        });
    },

    login: async (
        input: LoginInput,
        refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
        const { username, password } = input;

        const user = await userService.getUserByUsername(username);

        if (!username || !password || !user || !(await verify(user.password, password))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.INVALID_CREDENTIALS);
        }

        const now = new Date();

        if (user.lockoutUntil && user.lockoutUntil > now) {
            const minutesLeft = Math.ceil((user.lockoutUntil.getTime() - now.getTime()) / 60000);
            throw createError(statusCodes.clientError.FORBIDDEN, errorMessages.ACCOUNT_LOCKED);
        }

        const isPasswordValid = await verify(user.password, password);
        if (!isPasswordValid) {
            const failedAttempts = user.failedLoginAttempts + 1;

            const updates: any = { failedLoginAttempts: failedAttempts };

            if (failedAttempts >= 5) {
                updates.lockoutUntil = new Date(now.getTime() + LOGIN_LOCKOUT_DURATION_MINUTES * 60 * 1000);
            }

            await prismaClient.user.update({
                where: { id: user.id },
                data: updates,
            });

            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.INVALID_CREDENTIALS);
        }

        await prismaClient.user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: 0,
                lockoutUntil: null,
            },
        });

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
