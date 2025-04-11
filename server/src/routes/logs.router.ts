import { Router } from 'express';
import { logsController } from '@/controllers';
import { authenticate, protect, validate } from '@/middlewares';

const logsRouter = Router();

logsRouter.get('/', authenticate, protect('ADMIN'), logsController.getLogs);

export { logsRouter };
