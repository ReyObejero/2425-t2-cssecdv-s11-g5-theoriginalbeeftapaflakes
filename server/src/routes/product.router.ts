import { Router } from 'express';
import { productController } from '@/controllers';
import { authenticate, protect, validate } from '@/middlewares';
import { deletePackageSchema, getProductByIdSchema, createProductSchema, updateProductSchema } from '@/validations';

const productRouter = Router();

productRouter.get('/', productController.getProducts);
productRouter.get('/:productId', validate(getProductByIdSchema), productController.getProduct);
productRouter.post('/', authenticate, protect, validate(createProductSchema), productController.createProduct);
productRouter.put('/:productId', authenticate, protect, validate(updateProductSchema), productController.updateProduct);
productRouter.delete('/:productId', authenticate, protect, productController.deleteProduct);
productRouter.delete(
    '/:productId/:packageId',
    authenticate,
    protect,
    validate(deletePackageSchema),
    productController.deletePackage,
);

export { productRouter };
