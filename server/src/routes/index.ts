import { type Application, type Request, type Response, type NextFunction } from 'express';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { authRouter } from './auth.router';
import { cartRouter } from './cart.router';
import { orderRouter } from './order.router';
import { productRouter } from './product.router';
import { reportRouter } from './report.router';
import { reviewRouter } from './review.router';
import { staticPageRouter } from './static-page.router';
import { userRouter } from './user.router';

export const mountRoutes = (app: Application): void => {
    app.use('/auth', authRouter);
    app.use('/carts', cartRouter);
    app.use('/orders', orderRouter);
    app.use('/products', productRouter);
    app.use('/reports', reportRouter);
    app.use('/reviews', reviewRouter);
    app.use('/static-pages', staticPageRouter);
    app.use('/users', userRouter);
    app.use((req: Request, res: Response, next: NextFunction): void =>
        next(createError(statusCodes.clientError.NOT_FOUND, errorMessages.RESOURCE_NOT_FOUND)),
    );
};
