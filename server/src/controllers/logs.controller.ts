import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { sendResponse } from '@/utils';

export const logsController = {
    getLogs: async (req: Request, res: Response): Promise<void> => {
        const logs = await prismaClient.log.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return sendResponse(res, statusCodes.successful.OK, { data: logs });
    },
};
