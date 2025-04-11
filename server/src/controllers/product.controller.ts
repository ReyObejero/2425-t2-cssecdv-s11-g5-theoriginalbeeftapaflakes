import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';
import { productService } from '@/services';

export const productController = {
    getProduct: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const product = await productService.getProduct(Number(req.params.productId));
        return sendResponse(res, statusCodes.successful.OK, { data: product });
    }),

    getProducts: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const products = await productService.getProducts();
        return sendResponse(res, statusCodes.successful.OK, { data: { items: products } });
    }),

    createProduct: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const product = await productService.createProduct(req.body);
        return sendResponse(res, statusCodes.successful.CREATED, { data: product });
    }),

    updateProduct: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const product = await productService.updateProduct(Number(req.params.productId), req.body);
        return sendResponse(res, statusCodes.successful.OK, { data: product });
    }),

    deleteProduct: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const product = await productService.deleteProduct(Number(req.params.productId));
        return sendResponse(res, statusCodes.successful.OK, { data: product });
    }),

    deletePackage: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const { productId, packageId } = req.params;
        const productPackage = await productService.deletePackage(Number(productId), Number(packageId));
        return sendResponse(res, statusCodes.successful.OK, { data: productPackage });
    }),
};
