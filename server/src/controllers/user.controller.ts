import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { userService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';

export const userController = {
    getAuthenticatedUser: async (req: Request, res: Response): Promise<void> => {
        const user = await userService.getUserById(req!.jwtPayload!.userId);

        return sendResponse(res, statusCodes.successful.OK, { data: user });
    },

    getUser: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const user = await userService.getUserByUsername(req.params.username);

        return sendResponse(res, statusCodes.successful.OK, { data: user });
    }),

    getUsers: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const users = await userService.getUsers();

        return sendResponse(res, statusCodes.successful.OK, {
            data: { items: users },
        });
    }),

    resetPassword: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const { newPassword, securityAnswer } = req.body;
        const userId = req!.jwtPayload!.userId;

        const user = await userService.resetPassword(userId, newPassword, securityAnswer);

        return sendResponse(res, statusCodes.successful.OK, {
            data: user,
        });
    }),

    updateUser: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const { address } = req.body;
        const user = await userService.updateUserAddress(req.params.username, address);

        return sendResponse(res, statusCodes.successful.OK, {
            data: user,
        });
    }),
};
