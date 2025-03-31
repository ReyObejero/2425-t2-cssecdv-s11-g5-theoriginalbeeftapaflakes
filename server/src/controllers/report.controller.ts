import { OrderStatus } from '@prisma/client';
import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';
import { reportService } from '@/services';

export const reportController = {
    getSales: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const { productId, packageId, orderStatus, startDate, endDate } = req.query;
        const sales = await reportService.getSales(
            productId ? Number(productId) : undefined,
            packageId ? Number(packageId) : undefined,
            orderStatus as OrderStatus | undefined,
            startDate ? new Date(startDate as string) : undefined,
            endDate ? new Date(endDate as string) : undefined,
        );

        return sendResponse(res, statusCodes.successful.OK, { data: { items: sales } });
    }),
};
