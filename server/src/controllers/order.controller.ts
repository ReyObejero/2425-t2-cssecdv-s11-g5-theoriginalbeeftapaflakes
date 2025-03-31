import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';
import { orderService } from '@/services';

export const orderController = {
    createOrder: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const {
            productId,
            packageId,
            quantity,
            price,
            cardNumber,
            cardExpirationYear,
            cardExpirationMonth,
            cardSecurityCode,
        } = req.body;
        const order = await orderService.createOrder(req!.jwtPayload!.userId, productId, packageId, quantity, price, {
            number: cardNumber,
            expiry: `${cardExpirationYear}-${cardExpirationMonth}`,
            security_code: cardSecurityCode,
        });

        return sendResponse(res, statusCodes.successful.CREATED, { data: order });
    }),

    getAuthenticatedUserOrders: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const orders = await orderService.getOrdersByUserId(req!.jwtPayload!.userId);

        return sendResponse(res, statusCodes.successful.OK, { data: { items: orders } });
    }),

    getOrders: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const orders = await orderService.getOrdersByUserId(req!.jwtPayload!.userId);

        return sendResponse(res, statusCodes.successful.OK, { data: { items: orders } });
    }),

    updateOrderStatus: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const order = await orderService.updateOrderStatus(
            req!.jwtPayload!.userId,
            Number(req.params.orderId),
            req.body.updatedStatus,
            new Date(),
        );

        return sendResponse(res, statusCodes.successful.OK, { data: order });
    }),
};
