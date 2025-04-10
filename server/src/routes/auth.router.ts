import { Router } from 'express';
import { authController } from '@/controllers';
import { authenticate, protect, validate } from '@/middlewares';
import { loginSchema, registerSchema } from '@/validations';

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/register/admin', authenticate, protect, validate(registerSchema), authController.register);
authRouter.delete('/logout', authenticate, authController.logout);

export { authRouter };
