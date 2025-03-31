import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { cartService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';

export const cartController = {
    createCartItem: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const { productId, packageId } = req.body;
        const cartItem = await cartService.createCartItem(
            req!.jwtPayload!.userId,
            productId,
            packageId,
            req.body.quantity,
        );

        return sendResponse(res, statusCodes.successful.OK, { data: cartItem });
    }),

    getAuthenticatedUserCart: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const cart = await cartService.getCartByUserId(req!.jwtPayload!.userId);

        return sendResponse(res, statusCodes.successful.OK, { data: cart });
    }),

    getCarts: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const carts = await cartService.getCarts();

        return sendResponse(res, statusCodes.successful.OK, { data: { items: carts } });
    }),

    updateCartItem: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const cart = await cartService.updateCartItem(Number(req.params.cartItemId), req.body.quantity);

        return sendResponse(res, statusCodes.successful.OK, { data: { cart } });
    }),

    deleteCartItem: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const cartItem = await cartService.deleteCartItem(Number(req.params.cartItemId));

        return sendResponse(res, statusCodes.successful.OK, { data: cartItem });
    }),

    deleteCarts: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const carts = await cartService.deleteCarts();

        return sendResponse(res, statusCodes.successful.OK, { data: { items: carts } });
    }),
};
