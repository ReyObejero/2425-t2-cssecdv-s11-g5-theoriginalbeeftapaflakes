import { Router } from 'express';
import { productController } from '@/controllers';
import { authenticate, protect, validate } from '@/middlewares';
import { deletePackageSchema, getProductByIdSchema } from '@/validations';

const productRouter = Router();

productRouter.get('/', productController.getProducts);
productRouter.get('/:productId', validate(getProductByIdSchema), productController.getProduct);
productRouter.delete(
    '/:productId/:packageId',
    authenticate,
    protect,
    validate(deletePackageSchema),
    productController.deletePackage,
);

export { productRouter };
