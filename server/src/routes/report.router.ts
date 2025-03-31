import { Router } from 'express';
import { reportController } from '@/controllers';
import { authenticate, protect, validate } from '@/middlewares';
import { getSalesSchema } from '@/validations';

const reportRouter = Router();

reportRouter.get('/sales', authenticate, protect, validate(getSalesSchema), reportController.getSales);

export { reportRouter };
