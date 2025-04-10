import { Router } from 'express';
import { userController } from '@/controllers';
import { authenticate, validate } from '@/middlewares';
import { resetPasswordSchema } from '@/validations';

const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/me', authenticate, userController.getAuthenticatedUser);
userRouter.get('/password-reset', authenticate, validate(resetPasswordSchema), userController.resetPassword);
userRouter.put('/:username', authenticate, userController.updateUser);

export { userRouter };
