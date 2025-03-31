import { Router } from 'express';
import { cartController } from '@/controllers';
import { authenticate, protect, validate } from '@/middlewares';
import { deleteCartItemSchema, createCartItemSchema, updateCartItemSchema } from '@/validations';

const cartRouter = Router();

cartRouter.post('/items', authenticate, validate(createCartItemSchema), cartController.createCartItem);
cartRouter.get('/', cartController.getCarts);
cartRouter.get('/me', authenticate, cartController.getAuthenticatedUserCart);
cartRouter.put('/items/:cartItemId', authenticate, validate(updateCartItemSchema), cartController.updateCartItem);
cartRouter.delete('/', authenticate, protect, cartController.deleteCarts);
cartRouter.delete('/items/:cartItemId', authenticate, validate(deleteCartItemSchema), cartController.deleteCartItem);

export { cartRouter };
