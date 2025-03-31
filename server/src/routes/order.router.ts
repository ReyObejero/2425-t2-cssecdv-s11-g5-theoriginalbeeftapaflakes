import { Router } from 'express';
import { orderController } from '@/controllers';
import { authenticate, protect, validate } from '@/middlewares';
import { createOrderSchema, updateOrderStatusSchema } from '@/validations';

const orderRouter = Router();

orderRouter.post('/', authenticate, validate(createOrderSchema), orderController.createOrder);
orderRouter.get('/', authenticate, protect, orderController.getOrders);
orderRouter.get('/me', authenticate, orderController.getAuthenticatedUserOrders);
orderRouter.put('/:orderId', authenticate, validate(updateOrderStatusSchema), orderController.updateOrderStatus);

export { orderRouter };
