import { Router } from 'express';
import { userController } from '@/controllers';
import { authenticate } from '@/middlewares';

const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/me', authenticate, userController.getAuthenticatedUser);
userRouter.get('/:username', userController.getUser);
userRouter.put('/:username', authenticate, userController.updateUser);

export { userRouter };
