import { type CookieOptions, type Request, type Response } from 'express';
import { env } from '@/config';
import { statusCodes } from '@/constants';
import { authService } from '@/services';
import { asyncRequestHandlerWrapper, getTokenFromHeader, sendResponse, timeStringToMilliseconds } from '@/utils';

export const authController = {
    register: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const user = await authService.register(req.body, req.jwtPayload?.role);

        return sendResponse(res, statusCodes.successful.CREATED, { data: user });
    }),

    login: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const { accessToken, refreshToken, user } = await authService.login(
            req.body,
            getTokenFromHeader(req.headers['authorization']),
        );

        return sendResponse(res, statusCodes.successful.CREATED, { data: user, token: accessToken });
    }),

    logout: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const user = await authService.logout(req!.jwtPayload!.userId);
        res.clearCookie(env.jwt.ACCESS_TOKEN_COOKIE_NAME);
        res.clearCookie(env.jwt.REFRESH_TOKEN_COOKIE_NAME);

        return sendResponse(res, statusCodes.successful.OK, { data: user });
    }),
};
